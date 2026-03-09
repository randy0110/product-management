# Seed data for Product Management
# Idempotent: safe to run multiple times

puts '🌱 Seeding products...'

products = [
  { name: 'Wireless Noise-Canceling Headphones', description: 'Premium over-ear headphones with 30h battery life and active noise cancellation.', price: 299.99, stock: 50, sku: 'AUDIO001', active: true },
  { name: 'Mechanical RGB Keyboard', description: 'Full-size mechanical keyboard with Cherry MX switches and per-key RGB backlight.', price: 149.99, stock: 80, sku: 'KB002RGB', active: true },
  { name: 'Ergonomic Mouse', description: 'Vertical ergonomic wireless mouse, reduces wrist strain. DPI adjustable 800-3200.', price: 59.99, stock: 120, sku: 'MOUSE003', active: true },
  { name: '4K IPS Monitor 27"', description: 'Ultra-sharp 27-inch 4K IPS display with 99% sRGB coverage and USB-C connectivity.', price: 549.99, stock: 30, sku: 'MON004K4', active: true },
  { name: 'USB-C Hub 10-in-1', description: 'Compact 10-in-1 USB-C hub with HDMI, SD card reader, Ethernet, and 100W PD.', price: 79.99, stock: 200, sku: 'HUB005C1', active: true },
  { name: 'Webcam 1080p HD', description: 'Wide-angle 1080p webcam with built-in stereo microphone for video conferencing.', price: 89.99, stock: 60, sku: 'CAM006HD', active: true },
  { name: 'Portable SSD 1TB', description: 'Ultra-fast portable SSD with read speeds up to 1050 MB/s and USB 3.2 Gen 2.', price: 119.99, stock: 90, sku: 'SSD0071T', active: true },
  { name: 'Smart Standing Desk', description: 'Electric height-adjustable standing desk with memory presets. 140x70cm surface.', price: 699.99, stock: 15, sku: 'DESK008S', active: true },
  { name: 'Laptop Stand Adjustable', description: 'Premium aluminum laptop stand compatible with 10-17 inch laptops. Foldable design.', price: 39.99, stock: 300, sku: 'STND009A', active: true },
  { name: 'Wireless Charging Pad', description: 'Fast wireless charger compatible with iPhone 15W and Android 10W Qi-certified.', price: 29.99, stock: 150, sku: 'CHGR010W', active: true },
  { name: 'Bluetooth Speaker IPX7', description: 'Waterproof portable BT 5.0 speaker, 20h battery, 360-degree surround sound.', price: 89.99, stock: 70, sku: 'SPK011B7', active: true },
  { name: 'Smart Desk Lamp', description: 'LED desk lamp with wireless charging base, color temperature control and USB port.', price: 49.99, stock: 100, sku: 'LAMP012S', active: true },
  { name: 'Cable Management Kit', description: 'Complete cable management solution including 50 cable clips, sleeves and ties.', price: 19.99, stock: 500, sku: 'CBLE013K', active: false },
  { name: 'Anti-glare Screen Filter', description: '27-inch anti-glare privacy filter for widescreen monitors (16:9 ratio).', price: 34.99, stock: 0, sku: 'FILT014G', active: false },
  { name: 'Noise-Canceling Earbuds', description: 'True wireless earbuds with ANC, 8h battery life + 24h charging case, IPX5.', price: 179.99, stock: 45, sku: 'EBUD015N', active: true }
]

created = 0
updated = 0

products.each do |attrs|
  product = Product.find_or_initialize_by(sku: attrs[:sku])
  is_new   = product.new_record?
  product.assign_attributes(attrs)
  product.save!
  is_new ? created += 1 : updated += 1
end

puts "Semilla lista: #{created} creados, #{updated} actualizados. Total: #{Product.count} productos.
"

