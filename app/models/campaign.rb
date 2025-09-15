class Campaign < ApplicationRecord
  include UuidIdentifiable
  
  belongs_to :user
  
  validates :name, presence: true
  validates :status, presence: true, inclusion: { in: %w[draft active paused completed] }
end
