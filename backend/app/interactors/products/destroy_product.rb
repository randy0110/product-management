module Products
  class DestroyProduct
    include Interactor

    # context recibe: product (instancia a eliminar)
    # context devuelve: product_name (nombre del producto eliminado para el mensaje)
    def call
      product = context.product
      context.product_name = product.name

      begin
        product.discard!
      rescue Discard::NotDiscarded => e
        context.fail!(errors: [e.message])
      end
    end
  end
end
