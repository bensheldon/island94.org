# frozen_string_literal: true
require 'front_matter_parser'

class ApplicationModel
  include ActiveModel::Model
  include ActiveModel::Attributes

  def self.cache
    @_cache ||= {}
  end

  def self.reset
    @_cache = {}
  end
end
