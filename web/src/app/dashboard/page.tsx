"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import api from "@/lib/api";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      const [sumRes, clientsRes, apptRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/clients"),
        api.get("/appointments"),
      ]);
      setSummary(sumRes.data);
      setClients(clientsRes.data);
      setAppointments(apptRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
      <p style={{ color: "var(--muted)" }}>Carregando...</p>
    </div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <header className="border-b sticky top-0 z-10" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold" style={{ color: "var(--primary)" }}>CoreSaaS</h1>
            {user.subscription_type === "maximum_effort" && (
              <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ backgroundColor: "#e31c25" }}>
                MAXIMUM EFFORT
              </span>
            )}
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--bg)", color: "var(--muted)" }}>
              {user.role === "admin" ? "Admin" : "Cliente"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
              <button onClick={() => setTheme("light")} className="px-2 py-1 text-xs rounded" style={{ color: "var(--text)" }}>Light</button>
              <button onClick={() => setTheme("dark")} className="px-2 py-1 text-xs rounded" style={{ color: "var(--text)" }}>Dark</button>
              <button onClick={() => user.subscription_type === "maximum_effort" && setTheme("maximumeffort")}
                disabled={user.subscription_type !== "maximum_effort"}
                className="px-2 py-1 text-xs rounded disabled:opacity-40" style={{ color: "var(--text)" }}>Max Effort</button>
            </div>
            <button onClick={logout} className="text-sm" style={{ color: "var(--muted)" }}>Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {user.role === "admin" && summary && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Clientes</p>
                <p className="text-3xl font-bold mt-1" style={{ color: "var(--text)" }}>{summary.total_clients}</p>
              </div>
              <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Assinaturas Ativas</p>
                <p className="text-3xl font-bold mt-1" style={{ color: "var(--primary)" }}>{summary.active_subscriptions}</p>
              </div>
              <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Agendamentos Hoje</p>
                <p className="text-3xl font-bold mt-1" style={{ color: "var(--text)" }}>{summary.appointments_today}</p>
              </div>
              <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Receita do Mês</p>
                <p className="text-3xl font-bold mt-1 text-green-500">R$ {Number(summary.revenue_month || 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <h2 className="font-semibold" style={{ color: "var(--text)" }}>Clientes recentes</h2>
                </div>
                {clients.map((c) => (
                  <div key={c.id} className="px-5 py-3 border-b last:border-0 flex justify-between" style={{ borderColor: "var(--border)" }}>
                    <div>
                      <p className="font-medium" style={{ color: "var(--text)" }}>{c.name}</p>
                      <p className="text-sm" style={{ color: "var(--muted)" }}>{c.email}</p>
                    </div>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {c.active_subscription?.plan?.name || "Sem plano"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <h2 className="font-semibold" style={{ color: "var(--text)" }}>Próximos agendamentos</h2>
                </div>
                {appointments.map((a) => (
                  <div key={a.id} className="px-5 py-3 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <p className="font-medium" style={{ color: "var(--text)" }}>{a.title}</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {a.user?.name} • {new Date(a.scheduled_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {user.role === "client" && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Olá, {user.name}!</h2>
            <p style={{ color: "var(--muted)" }}>Use o app mobile para agendar e fazer check-in.</p>
            {user.active_subscription && (
              <p className="mt-4" style={{ color: "var(--primary)" }}>
                Plano ativo: {user.active_subscription.plan?.name}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
