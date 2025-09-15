Rails.application.routes.draw do
  devise_for :users, controllers: {
    confirmations: 'confirmations'
  }
  
  # Ruta para verificar unicidad de email
  post 'users/check_email', to: 'users#check_email'
  root "pages#home"
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  
  # Test email route
  get "test_email" => "test#send_test_email"
  
  # Contact form routes
  get "contact" => "pages#contact"
  post "contact" => "pages#submit_contact"
  
  # Resource routes with UUID support
  resources :campaigns, param: :uuid
  resources :prospects, param: :uuid
  
  # Devise integration routes for n8n webhooks
  post 'devise_integration/create_user', to: 'devise_integration#create_user'
  post 'devise_integration/reset_password', to: 'devise_integration#reset_password'
  post 'devise_integration/resend_confirmation', to: 'devise_integration#resend_confirmation'

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
