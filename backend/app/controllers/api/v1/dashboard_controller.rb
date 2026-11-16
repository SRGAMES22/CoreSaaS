module Api
  module V1
    class DashboardController < ApplicationController
      before_action :require_admin!

      def summary
        render json: {
          total_clients: User.client.count,
          active_subscriptions: Subscription.active.count,
          appointments_today: Appointment.where(scheduled_at: Time.current.beginning_of_day..Time.current.end_of_day).count,
          revenue_month: Payment.paid.where(paid_at: Date.today.beginning_of_month..Date.today.end_of_month).sum(:amount),
          pending_payments: Payment.pending.count
        }
      end
    end
  end
end
