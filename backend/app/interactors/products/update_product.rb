module Products
  class UpdateProduct
    include Interactor

    # context recibe: product (instancia existente), product_params (Hash con cambios)
    # context devuelve: product (instancia actualizada)
    def call
      product = context.product

      unless product.update(context.product_params)
        context.fail!(errors: product.errors.full_messages)
      end

      context.product = product
    end
  end
end
