# frozen_string_literal: true
module Markdownable
  extend ActiveSupport::Concern

  def render_markdown(text)
    Kramdown::Document.new(XrubyFilter.call(text), input: 'GFM').to_html.html_safe # rubocop:disable Rails/OutputSafety
  end
end
