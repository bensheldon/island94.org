module ApplicationHelper
  def title
    string = if content_for?(:whole_title)
      content_for(:whole_title)
    elsif content_for?(:title)
      "#{content_for(:title)} | Island94.org"
    else
      "Island94.org"
    end

    ActiveSupport::Inflector.transliterate(string)
  end
end
