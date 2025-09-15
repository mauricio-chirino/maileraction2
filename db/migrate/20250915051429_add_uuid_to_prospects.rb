class AddUuidToProspects < ActiveRecord::Migration[8.0]
  def change
    add_column :prospects, :uuid, :uuid, default: 'gen_random_uuid()', null: false
    add_index :prospects, :uuid, unique: true
  end
end
