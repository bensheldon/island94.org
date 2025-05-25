# frozen_string_literal: true
module MarkdownHelper
  def markdownify(text)
    Kramdown::Document.new(text, input: 'GFM').to_html.html_safe # rubocop:disable Rails/OutputSafety
  end
end
