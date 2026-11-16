class User < ApplicationRecord
  has_secure_password

  has_many :subscriptions, dependent: :destroy
  has_many :appointments, dependent: :destroy
  has_many :payments, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  enum role: { client: 0, admin: 1 }, _default: :client
  enum subscription_type: { free: 0, maximum_effort: 1 }, _default: :free

  def active_subscription
    subscriptions.where(status: :active).order(created_at: :desc).first
  end
end
