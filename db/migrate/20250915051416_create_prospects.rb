class CreateProspects < ActiveRecord::Migration[8.0]
  def change
    create_table :prospects do |t|
      t.string :name
      t.string :email
      t.string :company
      t.string :position
      t.string :industry
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
