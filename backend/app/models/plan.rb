class Plan < ApplicationRecord
  has_many :subscriptions, dependent: :restrict_with_error

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :duration_days, presence: true, numericality: { greater_than: 0 }
end
