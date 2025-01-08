require 'front_matter_parser'

class ApplicationModel
  include ActiveModel::Model

  def self.cache
    @_cache ||= {}
  end

  def self.reset
    @_cache = {}
  end
end

