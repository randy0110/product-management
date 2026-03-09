require 'rails_helper'

RSpec.describe Product, type: :model do
  subject(:product) { build(:product) }

  describe 'validations' do
    # Presence
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:price) }
    it { is_expected.to validate_presence_of(:stock) }
    it { is_expected.to validate_presence_of(:sku) }

    # Name length
    it { is_expected.to validate_length_of(:name).is_at_least(3).is_at_most(100) }

    # Description length
    it { is_expected.to validate_length_of(:description).is_at_most(1000) }

    # Price numericality
    it { is_expected.to validate_numericality_of(:price).is_greater_than(0) }

    # Stock numericality
    it { is_expected.to validate_numericality_of(:stock).is_greater_than_or_equal_to(0).only_integer }

    # SKU uniqueness
    it { is_expected.to validate_uniqueness_of(:sku).case_insensitive }

    # SKU format (uppercase letters and numbers only)
    context 'with a valid SKU' do
      it 'is valid with uppercase letters and numbers' do
        product.sku = 'PROD123'
        expect(product).to be_valid
      end
    end

    context 'with an invalid SKU' do
      it 'is invalid with lowercase letters' do
        product.sku = 'prod123'
        expect(product).not_to be_valid
        expect(product.errors[:sku]).to include('only allows uppercase letters and numbers')
      end

      it 'is invalid with special characters' do
        product.sku = 'PROD-123!'
        expect(product).not_to be_valid
      end
    end
  end

  describe 'defaults' do
    it 'defaults active to true' do
      product = Product.new
      expect(product.active).to be true
    end

    it 'defaults stock to 0' do
      product = Product.new
      expect(product.stock).to eq(0)
    end
  end

  describe 'scopes' do
    let!(:active_product)   { create(:product, active: true) }
    let!(:inactive_product) { create(:product, active: false) }

    describe '.active_products' do
      it 'returns only active products' do
        expect(Product.active_products).to include(active_product)
        expect(Product.active_products).not_to include(inactive_product)
      end
    end

    describe '.inactive_products' do
      it 'returns only inactive products' do
        expect(Product.inactive_products).to include(inactive_product)
        expect(Product.inactive_products).not_to include(active_product)
      end
    end

    describe '.search_by_name' do
      let!(:matching_product)     { create(:product, name: 'Widget Pro') }
      let!(:non_matching_product) { create(:product, name: 'Gadget Base') }

      it 'returns products matching the search term (case-insensitive)' do
        expect(Product.search_by_name('widget')).to include(matching_product)
        expect(Product.search_by_name('widget')).not_to include(non_matching_product)
      end

      it 'returns all products when no search term is given' do
        expect(Product.search_by_name(nil).count).to be >= 1
      end
    end
  end

  describe 'auditing' do
    it 'tracks changes via audited gem' do
      product = create(:product)
      expect(product).to respond_to(:audits)
      expect(product.audits.count).to eq(1) # creation audit
    end
  end
end
