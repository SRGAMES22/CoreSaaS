class Appointment < ApplicationRecord
  belongs_to :user

  enum status: { scheduled: 0, completed: 1, cancelled: 2, no_show: 3 }, _default: :scheduled

  validates :title, presence: true
  validates :scheduled_at, presence: true
end
