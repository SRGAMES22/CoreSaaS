module Api
  module V1
    class SubscriptionsController < ApplicationController
      def index
        if current_user.admin?
          subscriptions = Subscription.includes(:user, :plan).order(created_at: :desc).limit(50)
        else
          subscriptions = current_user.subscriptions.includes(:plan).order(created_at: :desc)
        end

        render json: subscriptions.as_json(include: [:user, :plan])
      end

      def create
        plan = Plan.find(params[:plan_id])
        starts = Date.today
        ends = starts + plan.duration_days.days

        subscription = current_user.subscriptions.build(
          plan: plan,
          starts_at: starts,
          ends_at: ends,
          status: :active
        )

        if subscription.save
          render json: subscription.as_json(include: :plan), status: :created
        else
          render json: { errors: subscription.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        subscription = if current_user.admin?
                         Subscription.find(params[:id])
                       else
                         current_user.subscriptions.find(params[:id])
                       end

        if subscription.update(subscription_params)
          render json: subscription.as_json(include: :plan)
        else
          render json: { errors: subscription.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def subscription_params
        params.permit(:status)
      end
    end
  end
end
