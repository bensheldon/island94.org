# frozen_string_literal: true
class RedirectsController < ApplicationController
  layout false, only: :show

  def index
    @redirects = Redirect.all
  end
end
