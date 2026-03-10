class Product < ApplicationRecord
  include Discard::Model

  audited

  # ─── Validations ───────────────────────────────────────────────────────────

  validates :name,        presence: true,
                          length: { minimum: 3, maximum: 100 }

  validates :description, length: { maximum: 1000 }, allow_blank: true

  validates :price,       presence: true,
                          numericality: { greater_than: 0 }

  validates :stock,       presence: true,
                          numericality: { greater_than_or_equal_to: 0, only_integer: true }

  validates :sku,         presence: true,
                          uniqueness: { case_sensitive: false },
                          format: {
                            with: /\A[A-Z0-9]+\z/,
                            message: 'only allows uppercase letters and numbers'
                          }

  validates :active,      inclusion: { in: [true, false] }

  # ─── Defaults ──────────────────────────────────────────────────────────────

  attribute :active, :boolean, default: true
  attribute :stock,  :integer, default: 0

  # ─── Scopes ────────────────────────────────────────────────────────────────

  scope :active_products,   -> { where(active: true) }
  scope :inactive_products, -> { where(active: false) }

  scope :search_by_name, ->(term) {
    return all if term.blank?
    where('name ILIKE ?', "%#{sanitize_sql_like(term)}%")
  }

  scope :filter_by_status, ->(status) {
    return all if status.nil?
    active_val = ActiveRecord::Type::Boolean.new.cast(status)
    where(active: active_val)
  }
end
