Designer::Engine.routes.draw do
  get ':resource_name/:id/edit', to: 'editor#show', as: :editor
  patch ':resource_name/:id/edit', to: 'editor#update'

  resources :attachments, param: :key, only: [:index, :create, :destroy] do
    get :thumbnail
  end
end
