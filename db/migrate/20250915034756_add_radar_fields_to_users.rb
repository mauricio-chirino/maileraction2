class AddRadarFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :website, :string
    add_column :users, :domain_email, :string
  end
end
