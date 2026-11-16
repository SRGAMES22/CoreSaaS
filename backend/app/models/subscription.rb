class Subscription < ApplicationRecord
  belongs_to :user
  belongs_to :plan

  enum status: { active: 0, expired: 1, cancelled: 2 }, _default: :active

  validates :starts_at, presence: true
  validates :ends_at, presence: true
end
