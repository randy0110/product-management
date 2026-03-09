class ProductBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :description, :price, :stock, :sku, :active, :created_at, :updated_at
end
