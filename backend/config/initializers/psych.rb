# Ruby 3.1+ with Psych 4 restricts YAML deserialization by default.
# audited gem serializes decimal attribute changes using YAML which includes BigDecimal.
# Add BigDecimal to the permitted classes so audits are stored/loaded correctly.
Rails.application.config.active_record.yaml_column_permitted_classes = [
  BigDecimal,
  Symbol,
  Date,
  Time,
  ActiveSupport::TimeWithZone,
  ActiveSupport::TimeZone
]
