class CreateSubscriptions < ActiveRecord::Migration[7.2]
  def change
    create_table :subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :plan, null: false, foreign_key: true
      t.integer :status, default: 0, null: false
      t.date :starts_at, null: false
      t.date :ends_at, null: false

      t.timestamps
    end
  end
end
