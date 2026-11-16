class CreatePayments < ActiveRecord::Migration[7.2]
  def change
    create_table :payments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :subscription, foreign_key: true
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.integer :status, default: 0, null: false
      t.string :method
      t.date :paid_at

      t.timestamps
    end
  end
end
