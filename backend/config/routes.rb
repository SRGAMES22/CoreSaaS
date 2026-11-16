Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "auth/login",    to: "auth#login"
      post "auth/register", to: "auth#register"
      get  "auth/me",       to: "auth#me"

      resources :plans, only: [:index, :show, :create, :update]

      resources :subscriptions, only: [:index, :create, :update]

      resources :appointments, only: [:index, :create, :update, :destroy] do
        member do
          post :check_in
        end
      end

      resources :payments, only: [:index, :create]

      get "dashboard/summary", to: "dashboard#summary"
      get "clients", to: "users#clients"
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
