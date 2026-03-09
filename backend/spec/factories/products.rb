FactoryBot.define do
  factory :product do
    name        { Faker::Commerce.product_name.truncate(100) }
    description { Faker::Lorem.sentence(word_count: 10) }
    price       { Faker::Commerce.price(range: 1.0..999.99) }
    stock       { Faker::Number.between(from: 0, to: 100) }
    sku         { "SKU#{Faker::Alphanumeric.alphanumeric(number: 6).upcase}" }
    active      { true }
  end
end
