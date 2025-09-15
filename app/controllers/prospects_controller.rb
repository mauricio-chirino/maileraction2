class ProspectsController < ApplicationController
  include UuidFindable
  
  before_action :authenticate_user!
  before_action :set_prospect, only: [:show, :edit, :update, :destroy]

  def index
    @prospects = current_user.prospects.order(created_at: :desc)
  end

  def show
    # @prospect ya está establecido por UuidFindable
  end

  def new
    @prospect = current_user.prospects.build
  end

  def create
    @prospect = current_user.prospects.build(prospect_params)
    
    if @prospect.save
      redirect_to prospect_path(@prospect.uuid), notice: 'Prospecto creado exitosamente.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    # @prospect ya está establecido por UuidFindable
  end

  def update
    if @prospect.update(prospect_params)
      redirect_to prospect_path(@prospect.uuid), notice: 'Prospecto actualizado exitosamente.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @prospect.destroy
    redirect_to prospects_path, notice: 'Prospecto eliminado exitosamente.'
  end

  private

  def set_prospect
    @prospect = current_user.prospects.find_by(uuid: params[:id])
    redirect_to prospects_path, alert: 'Prospecto no encontrado' unless @prospect
  end

  def prospect_params
    params.require(:prospect).permit(:name, :email, :company, :position, :industry)
  end
end
