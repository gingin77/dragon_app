Rails.application.routes.draw do
  resources :dragons, only: :index
end
