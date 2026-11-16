# CoreSaaS 🏢

**SaaS de Gestão Completo** (Academias / Clínicas / Escolas)  
Painel administrativo poderoso + App do cliente final.

[![GitHub](https://img.shields.io/badge/GitHub-SRGAMES22%2FCoreSaaS-blue?logo=github)](https://github.com/SRGAMES22/CoreSaaS)

---

## Stack

| Camada           | Tecnologia                              |
|------------------|-----------------------------------------|
| Backend          | Ruby on Rails 7.2 (API) + PostgreSQL + JWT |
| Web (Admin)      | Next.js 14 + Tailwind CSS               |
| Mobile (Cliente) | React Native (Expo)                     |
| Temas            | Light / Dark / **Maximum Effort** (pago)|

---

## Funcionalidades

### Painel Admin
- Dashboard com métricas (clientes, assinaturas, receita, agendamentos)
- Lista de clientes e planos ativos
- Visualização de agendamentos

### App do Cliente
- Visualização do plano ativo
- Lista de agendamentos
- Check-in com um toque

### Geral
- Auth JWT com roles (admin / client)
- Planos, assinaturas e pagamentos
- **3 Temas**: Light / Dark / **Maximum Effort**

---

## Como rodar

### Backend
```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails s -p 3000
```

**Usuários demo:**
- Admin: `admin@coresaas.app` / `123456` (plano Maximum Effort)
- Cliente: `cliente@coresaas.app` / `123456`

### Web (Admin)
```bash
cd web
npm install
npm run dev
```

### Mobile (Cliente)
```bash
cd mobile
npm install
npx expo start
```

---

## Status

✅ Backend completo (Auth, Plans, Subscriptions, Appointments, Payments, Dashboard)  
✅ Web Admin com Login + Dashboard + métricas + listas  
✅ Mobile Cliente com Login + Agendamentos + Check-in  
✅ Tema **Maximum Effort** exclusivo para plano pago  
✅ Seeds com admin, cliente, planos, assinatura e agendamentos  

---

Feito por **[SRGAMES22](https://github.com/SRGAMES22)**
