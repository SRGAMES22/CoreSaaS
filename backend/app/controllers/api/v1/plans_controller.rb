module Api
  module V1
    class PlansController < ApplicationController
      before_action :require_admin!, only: [:create, :update]

      def index
        plans = Plan.where(active: true).order(:price)
        render json: plans
      end

      def show
        plan = Plan.find(params[:id])
        render json: plan
      end

      def create
        plan = Plan.new(plan_params)

        if plan.save
          render json: plan, status: :created
        else
          render json: { errors: plan.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        plan = Plan.find(params[:id])

        if plan.update(plan_params)
          render json: plan
        else
          render json: { errors: plan.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def plan_params
        params.permit(:name, :description, :price, :duration_days, :active)
      end
    end
  end
end
