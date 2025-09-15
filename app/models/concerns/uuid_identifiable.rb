module UuidIdentifiable
  extend ActiveSupport::Concern

  included do
    before_create :generate_uuid
    validates :uuid, presence: true, uniqueness: true
  end

  private

  def generate_uuid
    self.uuid ||= SecureRandom.uuid
  end
end
