Designer::Engine.routes.draw do
  # resource :designer, controller: :designer, path: :designer do
  #   # scope module: :designer do
  #   #   resources :images, only: [:index, :create, :destroy]
  #   # end
  #   # member do
  #   #   get :preview
  #   # end
  # end

  get ':resource_name/:id/edit', to: 'editor#show', as: :editor
  put ':resource_name/:id/edit', to: 'editor#update'

  resources :images, only: [:index, :create, :destroy]
end
