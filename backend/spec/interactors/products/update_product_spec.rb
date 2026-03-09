require 'rails_helper'

RSpec.describe Products::UpdateProduct, type: :interactor do
  describe '.call' do
    let!(:product) { create(:product, name: 'Original', price: 50.0) }

    subject(:result) { described_class.call(product: product, product_params: params) }

    context 'con parámetros válidos' do
      let(:params) { { name: 'Actualizado', price: 75.99 } }

      it 'tiene éxito' do
        expect(result).to be_a_success
      end

      it 'actualiza los atributos del producto' do
        result
        product.reload
        expect(product.name).to eq('Actualizado')
        expect(product.price).to eq(75.99)
      end

      it 'devuelve el producto actualizado en el contexto' do
        expect(result.product.name).to eq('Actualizado')
      end

      it 'registra una auditoría adicional' do
        expect { result }.to change { product.audits.count }.by(1)
      end
    end

    context 'con parámetros inválidos' do
      let(:params) { { name: 'ab', price: -5 } }

      it 'falla' do
        expect(result).to be_a_failure
      end

      it 'no modifica el producto' do
        result
        product.reload
        expect(product.name).to eq('Original')
        expect(product.price).to eq(50.0)
      end

      it 'expone errores en el contexto' do
        expect(result.errors).to be_an(Array)
        expect(result.errors).not_to be_empty
      end
    end
  end
end
