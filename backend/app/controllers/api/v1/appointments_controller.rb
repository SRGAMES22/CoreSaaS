module Api
  module V1
    class AppointmentsController < ApplicationController
      def index
        if current_user.admin?
          appointments = Appointment.includes(:user).order(scheduled_at: :desc).limit(50)
        else
          appointments = current_user.appointments.order(scheduled_at: :desc)
        end

        render json: appointments.as_json(include: { user: { only: [:id, :name, :email] } })
      end

      def create
        appointment = current_user.appointments.build(appointment_params)

        if appointment.save
          render json: appointment, status: :created
        else
          render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        appointment = if current_user.admin?
                        Appointment.find(params[:id])
                      else
                        current_user.appointments.find(params[:id])
                      end

        if appointment.update(appointment_params)
          render json: appointment
        else
          render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        appointment = current_user.appointments.find(params[:id])
        appointment.destroy
        head :no_content
      end

      def check_in
        appointment = if current_user.admin?
                        Appointment.find(params[:id])
                      else
                        current_user.appointments.find(params[:id])
                      end

        appointment.update(status: :completed, checked_in_at: Time.current)
        render json: appointment
      end

      private

      def appointment_params
        params.permit(:title, :notes, :scheduled_at, :status)
      end
    end
  end
end
