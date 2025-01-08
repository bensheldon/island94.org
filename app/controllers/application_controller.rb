class ApplicationController < ActionController::Base
  before_action :resolve_redirects

  private

  def resolve_redirects
    return unless Redirect.path?(request.fullpath)

    redirect_to Redirect.path(request.fullpath), status: :temporary_redirect
  end
end
