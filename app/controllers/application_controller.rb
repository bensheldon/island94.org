class ApplicationController < ActionController::Base
  around_action :check_redirects_on_missing

  private

  def check_redirects_on_missing
    yield
  rescue ActionController::RoutingError
    # When there is a routing error check for redirects
    raise unless Redirect.path?(request.fullpath)

    redirect_to Redirect.path(request.fullpath), status: :temporary_redirect
  end
end
