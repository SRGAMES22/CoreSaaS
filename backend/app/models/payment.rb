class Payment < ApplicationRecord
  belongs_to :user
  belongs_to :subscription, optional: true

  enum status: { pending: 0, paid: 1, failed: 2, refunded: 3 }, _default: :pending

  validates :amount, presence: true, numericality: { greater_than: 0 }
end
