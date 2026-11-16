import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:3000/api/v1';

export default function HomeScreen() {
  const { user, token, logout } = useAuth();
  const { theme, themeName, setTheme } = useTheme();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { loadAppointments(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const handleCheckIn = async (appointment: any) => {
    try {
      await axios.post(`${API_URL}/appointments/${appointment.id}/check_in`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Sucesso', 'Check-in realizado!');
      loadAppointments();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível fazer check-in');
    }
  };

  const cycleTheme = () => {
    const order: any[] = ['light', 'dark'];
    if (user?.subscription_type === 'maximum_effort') order.push('maximumeffort');
    const next = order[(order.indexOf(themeName) + 1) % order.length];
    setTheme(next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.primary }}>CoreSaaS</Text>
            {user?.subscription_type === 'maximum_effort' && (
              <Text style={{ fontSize: 11, color: '#e31c25', fontWeight: '600' }}>MAXIMUM EFFORT</Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity onPress={cycleTheme}><Text style={{ color: theme.muted, fontSize: 13 }}>Tema</Text></TouchableOpacity>
            <TouchableOpacity onPress={logout}><Text style={{ color: theme.muted, fontSize: 13 }}>Sair</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 4 }}>Olá, {user?.name}</Text>

        {user?.active_subscription && (
          <View style={{ backgroundColor: theme.card, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.border }}>
            <Text style={{ color: theme.muted, fontSize: 12 }}>Plano ativo</Text>
            <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 16, marginTop: 4 }}>
              {user.active_subscription.plan?.name}
            </Text>
            <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>
              Válido até {user.active_subscription.ends_at}
            </Text>
          </View>
        )}

        <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Meus Agendamentos</Text>

        {appointments.map((appt) => (
          <View key={appt.id} style={{ backgroundColor: theme.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: theme.border }}>
            <Text style={{ color: theme.text, fontWeight: '600' }}>{appt.title}</Text>
            <Text style={{ color: theme.muted, fontSize: 13, marginTop: 4 }}>
              {new Date(appt.scheduled_at).toLocaleString('pt-BR')}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <Text style={{
                fontSize: 12,
                color: appt.status === 'completed' ? '#22c55e' : appt.status === 'cancelled' ? '#ef4444' : theme.muted
              }}>
                {appt.status === 'scheduled' ? 'Agendado' : appt.status === 'completed' ? 'Concluído' : appt.status}
              </Text>

              {appt.status === 'scheduled' && (
                <TouchableOpacity onPress={() => handleCheckIn(appt)}
                  style={{ backgroundColor: theme.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Check-in</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {appointments.length === 0 && (
          <Text style={{ color: theme.muted, textAlign: 'center', marginTop: 40 }}>Nenhum agendamento</Text>
        )}
      </ScrollView>
    </View>
  );
}
