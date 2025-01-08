class Redirect < ApplicationModel
  STATIC = {
    "posts" => "/"
  }

  def self.all
    cache[:all] ||= STATIC.merge(Post.redirects).to_h do |key, value|
      target = case value
      when String
        value
      when Post
        RouteHelper.post_path(value, only_path: true)
      else
        raise ArgumentError, "Invalid redirect target"
      end
      target = sanitize(target)

      [sanitize(key), "/#{target}"]
    end
  end

  def self.path?(path)
    all.key?(sanitize(path))
  end

  def self.path(path)
    all[sanitize(path)]
  end

  def self.sanitize(path)
    path.sub(%r{\A/}, "").sub(%r{/\z}, "")
  end
end
