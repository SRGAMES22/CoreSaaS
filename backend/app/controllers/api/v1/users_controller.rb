module Api
  module V1
    class UsersController < ApplicationController
      before_action :require_admin!

      def clients
        clients = User.client.order(created_at: :desc).limit(50)
        render json: clients.map { |u|
          {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            active_subscription: u.active_subscription&.as_json(include: :plan)
          }
        }
      end
    end
  end
end
