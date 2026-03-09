require 'rails_helper'

RSpec.describe Products::DestroyProduct, type: :interactor do
  describe '.call' do
    let!(:product) { create(:product, name: 'A Eliminar') }

    subject(:result) { described_class.call(product: product) }

    context 'con un producto existente' do
      it 'tiene éxito' do
        expect(result).to be_a_success
      end

      it 'elimina el producto de la base de datos' do
        expect { result }.to change(Product, :count).by(-1)
      end

      it 'guarda el nombre del producto en el contexto' do
        expect(result.product_name).to eq('A Eliminar')
      end
    end
  end
end
