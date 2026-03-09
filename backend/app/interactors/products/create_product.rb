module Products
  class CreateProduct
    include Interactor

    # context recibe: product_params (Hash con los atributos del producto)
    # context devuelve: product (instancia del producto creado)
    def call
      product = Product.new(context.product_params)

      unless product.save
        context.fail!(errors: product.errors.full_messages)
      end

      context.product = product
    end
  end
end
