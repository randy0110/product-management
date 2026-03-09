module Api
  module V1
    class ProductsController < ApplicationController
      before_action :set_product, only: %i[show update destroy]

      # GET /api/v1/products
      def index
        products = Product
          .search_by_name(params[:search])
          .filter_by_status(params[:active])
          .order(created_at: :desc)

        per_page = [[params.fetch(:per_page, 10).to_i, 1].max, 100].min
        pagy_instance, records = pagy(products, items: per_page)

        render json: {
          data: ProductBlueprint.render_as_hash(records),
          meta: {
            total_count:  pagy_instance.count,
            current_page: pagy_instance.page,
            total_pages:  pagy_instance.pages,
            per_page:     pagy_instance.vars[:items]
          }
        }, status: :ok
      end

      # GET /api/v1/products/:id
      def show
        render json: { data: ProductBlueprint.render_as_hash(@product) }, status: :ok
      end

      # POST /api/v1/products
      # Delega la logica de negocio al interactor Products::CreateProduct
      def create
        result = Products::CreateProduct.call(product_params: product_params)

        if result.success?
          render json: { data: ProductBlueprint.render_as_hash(result.product) }, status: :created
        else
          render json: { errors: result.errors }, status: :unprocessable_content
        end
      end

      # PUT /api/v1/products/:id
      # Delega la logica de negocio al interactor Products::UpdateProduct
      def update
        result = Products::UpdateProduct.call(product: @product, product_params: product_params)

        if result.success?
          render json: { data: ProductBlueprint.render_as_hash(result.product) }, status: :ok
        else
          render json: { errors: result.errors }, status: :unprocessable_content
        end
      end

      # DELETE /api/v1/products/:id
      # Delega la logica de negocio al interactor Products::DestroyProduct
      def destroy
        result = Products::DestroyProduct.call(product: @product)

        render json: { message: "Producto '#{result.product_name}' eliminado correctamente" },
               status: :ok
      end

      private

      def set_product
        @product = Product.find(params[:id])
      end

      def product_params
        params.require(:product).permit(:name, :description, :price, :stock, :sku, :active)
      end
    end
  end
end
