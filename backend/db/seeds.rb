puts "Criando dados de demonstração..."

admin = User.find_or_create_by!(email: "admin@coresaas.app") do |u|
  u.name = "Admin Maximum"
  u.password = "123456"
  u.password_confirmation = "123456"
  u.role = :admin
  u.subscription_type = :maximum_effort
end

client = User.find_or_create_by!(email: "cliente@coresaas.app") do |u|
  u.name = "Cliente Demo"
  u.password = "123456"
  u.password_confirmation = "123456"
  u.role = :client
  u.phone = "(11) 99999-9999"
end

puts "Admin: admin@coresaas.app / 123456"
puts "Cliente: cliente@coresaas.app / 123456"

if Plan.count.zero?
  Plan.create!([
    { name: "Básico", description: "Acesso às aulas em grupo", price: 89.90, duration_days: 30 },
    { name: "Premium", description: "Aulas + personal 2x/semana", price: 179.90, duration_days: 30 },
    { name: "Black", description: "Acesso total + nutrição", price: 299.90, duration_days: 30 }
  ])
end

plan = Plan.find_by(name: "Premium")

if client.subscriptions.count.zero? && plan
  sub = client.subscriptions.create!(
    plan: plan,
    starts_at: Date.today - 5,
    ends_at: Date.today + 25,
    status: :active
  )

  client.payments.create!(
    subscription: sub,
    amount: plan.price,
    status: :paid,
    method: "pix",
    paid_at: Date.today - 5
  )
end

if client.appointments.count.zero?
  client.appointments.create!([
    { title: "Treino Personal", scheduled_at: Time.current + 1.day, notes: "Foco em pernas" },
    { title: "Avaliação Física", scheduled_at: Time.current + 3.days },
    { title: "Treino Personal", scheduled_at: Time.current - 2.days, status: :completed, checked_in_at: Time.current - 2.days }
  ])
end

puts "Seeds finalizados!"
