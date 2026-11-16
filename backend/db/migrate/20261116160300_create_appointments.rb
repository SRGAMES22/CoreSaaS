class CreateAppointments < ActiveRecord::Migration[7.2]
  def change
    create_table :appointments do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :notes
      t.datetime :scheduled_at, null: false
      t.integer :status, default: 0, null: false
      t.datetime :checked_in_at

      t.timestamps
    end
  end
end
