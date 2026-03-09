module Products
  class DestroyProduct
    include Interactor

    # context recibe: product (instancia a eliminar)
    # context devuelve: product_name (nombre del producto eliminado para el mensaje)
    def call
      product = context.product
      context.product_name = product.name

      begin
        product.destroy!
      rescue ActiveRecord::RecordNotDestroyed => e
        context.fail!(errors: e.record.errors.full_messages)
      end
    end
  end
end
