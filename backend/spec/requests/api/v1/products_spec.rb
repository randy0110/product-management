require 'rails_helper'

RSpec.describe 'Api::V1::Products', type: :request do
  let(:valid_attributes) do
    {
      name: 'Test Product',
      description: 'A great product',
      price: 19.99,
      stock: 10,
      sku: 'TESTSKU01',
      active: true
    }
  end

  let(:invalid_attributes) do
    {
      name: 'AB',       # too short
      price: -5,        # negative
      stock: -1,        # negative
      sku: 'bad sku!'   # invalid format
    }
  end

  let(:headers) { { 'Content-Type' => 'application/json', 'Accept' => 'application/json' } }

  # ─────────────────────────────────────────────
  # GET /api/v1/products
  # ─────────────────────────────────────────────
  describe 'GET /api/v1/products' do
    let!(:active_products)   { create_list(:product, 3, active: true) }
    let!(:inactive_products) { create_list(:product, 2, active: false) }

    it 'returns http success' do
      get '/api/v1/products', headers: headers
      expect(response).to have_http_status(:ok)
    end

    it 'returns a paginated list of all products' do
      get '/api/v1/products', headers: headers
      json = response.parsed_body
      expect(json['data']).to be_an(Array)
      expect(json['meta']).to include('total_count', 'current_page', 'total_pages')
    end

    it 'filters by active status' do
      get '/api/v1/products', params: { active: true }, headers: headers
      json = response.parsed_body
      expect(json['data'].all? { |p| p['active'] == true }).to be true
    end

    it 'filters by inactive status' do
      get '/api/v1/products', params: { active: false }, headers: headers
      json = response.parsed_body
      expect(json['data'].all? { |p| p['active'] == false }).to be true
    end

    it 'searches by name (case-insensitive)' do
      matching = create(:product, name: 'UniqueWidget')
      get '/api/v1/products', params: { search: 'uniquewidget' }, headers: headers
      json = response.parsed_body
      names = json['data'].map { |p| p['name'] }
      expect(names).to include('UniqueWidget')
    end

    it 'paginates results with 10 items per page by default' do
      create_list(:product, 8)  # 5 already exist, total >= 10
      get '/api/v1/products', headers: headers
      json = response.parsed_body
      expect(json['data'].size).to be <= 10
      expect(json['meta']['per_page']).to eq(10)
    end
  end

  # ─────────────────────────────────────────────
  # GET /api/v1/products/:id
  # ─────────────────────────────────────────────
  describe 'GET /api/v1/products/:id' do
    let(:product) { create(:product) }

    it 'returns http success' do
      get "/api/v1/products/#{product.id}", headers: headers
      expect(response).to have_http_status(:ok)
    end

    it 'returns the product data' do
      get "/api/v1/products/#{product.id}", headers: headers
      json = response.parsed_body
      expect(json['data']['id']).to eq(product.id)
      expect(json['data']['name']).to eq(product.name)
      expect(json['data']['sku']).to eq(product.sku)
    end

    it 'returns 404 for a non-existent product' do
      get '/api/v1/products/99999', headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end

  # ─────────────────────────────────────────────
  # POST /api/v1/products
  # ─────────────────────────────────────────────
  describe 'POST /api/v1/products' do
    context 'with valid attributes' do
      it 'creates a product and returns 201' do
        expect do
          post '/api/v1/products', params: { product: valid_attributes }.to_json, headers: headers
        end.to change(Product, :count).by(1)
        expect(response).to have_http_status(:created)
      end

      it 'returns the created product data' do
        post '/api/v1/products', params: { product: valid_attributes }.to_json, headers: headers
        json = response.parsed_body
        expect(json['data']['name']).to eq('Test Product')
        expect(json['data']['sku']).to eq('TESTSKU01')
      end
    end

    context 'with invalid attributes' do
      it 'returns 422 Unprocessable Entity' do
        post '/api/v1/products', params: { product: invalid_attributes }.to_json, headers: headers
        expect(response).to have_http_status(:unprocessable_content)
      end

      it 'returns error details' do
        post '/api/v1/products', params: { product: invalid_attributes }.to_json, headers: headers
        json = response.parsed_body
        expect(json['errors']).to be_present
      end
    end
  end

  # ─────────────────────────────────────────────
  # PUT /api/v1/products/:id
  # ─────────────────────────────────────────────
  describe 'PUT /api/v1/products/:id' do
    let(:product) { create(:product) }

    context 'with valid attributes' do
      it 'updates the product and returns 200' do
        put "/api/v1/products/#{product.id}",
            params: { product: { name: 'Updated Name' } }.to_json,
            headers: headers
        expect(response).to have_http_status(:ok)
        expect(product.reload.name).to eq('Updated Name')
      end
    end

    context 'with invalid attributes' do
      it 'returns 422 Unprocessable Entity' do
        put "/api/v1/products/#{product.id}",
            params: { product: { price: -1 } }.to_json,
            headers: headers
        expect(response).to have_http_status(:unprocessable_content)
      end
    end

    it 'returns 404 for a non-existent product' do
      put '/api/v1/products/99999',
          params: { product: { name: 'Ghost' } }.to_json,
          headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end

  # ─────────────────────────────────────────────
  # DELETE /api/v1/products/:id
  # ─────────────────────────────────────────────
  describe 'DELETE /api/v1/products/:id' do
    let!(:product) { create(:product, name: 'Mi Producto Eliminado') }

    it 'destroys the product and returns 200' do
      expect do
        delete "/api/v1/products/#{product.id}", headers: headers
      end.to change(Product, :count).by(-1)
      expect(response).to have_http_status(:ok)
    end

    it 'returns a confirmation message with the product name' do
      delete "/api/v1/products/#{product.id}", headers: headers
      json = response.parsed_body
      expect(json['message']).to include('Mi Producto Eliminado')
    end

    it 'returns 404 for a non-existent product' do
      delete '/api/v1/products/99999', headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end

  # ─────────────────────────────────────────────
  # PATCH /api/v1/products/:id
  # ─────────────────────────────────────────────
  describe 'PATCH /api/v1/products/:id' do
    let(:product) { create(:product) }

    it 'actualiza parcialmente el producto y retorna 200' do
      patch "/api/v1/products/#{product.id}",
            params: { product: { stock: 999 } }.to_json,
            headers: headers
      expect(response).to have_http_status(:ok)
      expect(product.reload.stock).to eq(999)
    end

    it 'retorna 422 con atributos inválidos' do
      patch "/api/v1/products/#{product.id}",
            params: { product: { price: 0 } }.to_json,
            headers: headers
      expect(response).to have_http_status(:unprocessable_content)
    end

    it 'retorna 404 para un producto inexistente' do
      patch '/api/v1/products/99999',
            params: { product: { name: 'Ghost' } }.to_json,
            headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end

  # ─────────────────────────────────────────────
  # GET /api/v1/products — límites de per_page
  # ─────────────────────────────────────────────
  describe 'límites del parámetro per_page' do
    before { create_list(:product, 3) }

    it 'limita per_page a 100 como máximo' do
      get '/api/v1/products', params: { per_page: 9999 }, headers: headers
      json = response.parsed_body
      expect(json['meta']['per_page']).to eq(100)
    end

    it 'garantiza que per_page sea al menos 1' do
      get '/api/v1/products', params: { per_page: 0 }, headers: headers
      json = response.parsed_body
      expect(json['meta']['per_page']).to be >= 1
    end
  end
end
