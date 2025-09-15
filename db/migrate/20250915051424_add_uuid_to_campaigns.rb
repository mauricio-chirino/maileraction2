class AddUuidToCampaigns < ActiveRecord::Migration[8.0]
  def change
    add_column :campaigns, :uuid, :uuid, default: 'gen_random_uuid()', null: false
    add_index :campaigns, :uuid, unique: true
  end
end
