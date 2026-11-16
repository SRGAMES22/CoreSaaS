module Api
  module V1
    class PaymentsController < ApplicationController
      def index
        if current_user.admin?
          payments = Payment.includes(:user).order(created_at: :desc).limit(50)
        else
          payments = current_user.payments.order(created_at: :desc)
        end

        render json: payments.as_json(include: { user: { only: [:id, :name, :email] } })
      end

      def create
        payment = current_user.payments.build(payment_params)

        if payment.save
          render json: payment, status: :created
        else
          render json: { errors: payment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def payment_params
        params.permit(:amount, :status, :method, :subscription_id, :paid_at)
      end
    end
  end
end
