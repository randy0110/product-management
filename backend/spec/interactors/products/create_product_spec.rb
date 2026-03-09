require 'rails_helper'

RSpec.describe Products::CreateProduct, type: :interactor do
  describe '.call' do
    subject(:result) { described_class.call(product_params: params) }

    context 'con parámetros válidos' do
      let(:params) do
        {
          name:        'Producto de Prueba',
          description: 'Descripción opcional',
          price:       99.99,
          stock:       10,
          sku:         'TEST001',
          active:      true
        }
      end

      it 'tiene éxito' do
        expect(result).to be_a_success
      end

      it 'crea el producto en la base de datos' do
        expect { result }.to change(Product, :count).by(1)
      end

      it 'devuelve el producto en el contexto' do
        expect(result.product).to be_a(Product)
        expect(result.product.name).to eq('Producto de Prueba')
        expect(result.product).to be_persisted
      end

      it 'registra una auditoría' do
        result
        expect(result.product.audits.count).to eq(1)
      end
    end

    context 'con parámetros inválidos' do
      let(:params) { { name: 'ab', price: -1, sku: 'invalido minuscula' } }

      it 'falla' do
        expect(result).to be_a_failure
      end

      it 'no crea el producto' do
        expect { result }.not_to change(Product, :count)
      end

      it 'expone errores en el contexto' do
        expect(result.errors).to be_an(Array)
        expect(result.errors).not_to be_empty
      end
    end

    context 'con SKU duplicado' do
      let!(:existing) { create(:product, sku: 'DUPSKU1') }
      let(:params)    { attributes_for(:product, sku: 'DUPSKU1') }

      it 'falla' do
        expect(result).to be_a_failure
      end

      it 'incluye error de unicidad' do
        expect(result.errors.join).to match(/sku/i)
      end
    end
  end
end
