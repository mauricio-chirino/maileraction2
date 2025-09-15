class Prospect < ApplicationRecord
  include UuidIdentifiable
  
  belongs_to :user
  
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :company, presence: true
  validates :industry, presence: true
end
