Designer::Engine.routes.draw do
  get ':resource_name/:id', to: 'editor#show', as: :editor
  get ':resource_name/:id/data', to: 'editor#data', as: :data
  patch ':resource_name/:id', to: 'editor#update'

  resources :attachments, param: :key, only: [:index, :create, :destroy] do
    collection do
      post :direct_uploads
    end
    member do
      get :thumbnail
    end
  end
end
