class CampaignsController < ApplicationController
  include UuidFindable
  
  before_action :authenticate_user!
  before_action :set_campaign, only: [:show, :edit, :update, :destroy]

  def index
    @campaigns = current_user.campaigns.order(created_at: :desc)
  end

  def show
    # @campaign ya está establecido por UuidFindable
  end

  def new
    @campaign = current_user.campaigns.build
  end

  def create
    @campaign = current_user.campaigns.build(campaign_params)
    
    if @campaign.save
      redirect_to campaign_path(@campaign.uuid), notice: 'Campaña creada exitosamente.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    # @campaign ya está establecido por UuidFindable
  end

  def update
    if @campaign.update(campaign_params)
      redirect_to campaign_path(@campaign.uuid), notice: 'Campaña actualizada exitosamente.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @campaign.destroy
    redirect_to campaigns_path, notice: 'Campaña eliminada exitosamente.'
  end

  private

  def set_campaign
    @campaign = current_user.campaigns.find_by(uuid: params[:id])
    redirect_to campaigns_path, alert: 'Campaña no encontrada' unless @campaign
  end

  def campaign_params
    params.require(:campaign).permit(:name, :description, :status)
  end
end
