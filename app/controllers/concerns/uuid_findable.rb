module UuidFindable
  extend ActiveSupport::Concern

  included do
    before_action :set_resource_by_uuid, only: [:show, :edit, :update, :destroy]
  end

  private

  def set_resource_by_uuid
    resource_name = controller_name.singularize
    resource_class = resource_name.classify.constantize
    
    if params[:id].present?
      # Intentar encontrar por UUID primero
      if params[:id].match?(/\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i)
        @resource = resource_class.find_by(uuid: params[:id])
      else
        # Fallback a ID numérico si no es UUID
        @resource = resource_class.find(params[:id])
      end
      
      unless @resource
        redirect_to root_path, alert: "#{resource_name.humanize} no encontrado"
      end
    end
  end

  # Método helper para obtener el recurso
  def current_resource
    instance_variable_get("@#{controller_name.singularize}")
  end
end
