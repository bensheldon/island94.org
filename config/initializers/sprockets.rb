# frozen_string_literal: true
# Make sprockets build assets repeatably regardless of when the file was last modified
module SprocketsManifestExt
  def generate_manifest_path
    ".sprockets-manifest-#{'a' * 32}.json"
  end

  def save
    zero_time = Time.at(0).utc
    @data["files"].each do |(_path, asset)|
      asset["mtime"] = zero_time
    end

    super
  end

  Sprockets::Manifest.prepend self
end

Rails.application.configure do
  config.assets.gzip = false
end

# This is unnecessary when gzip is disabled, but here for completeness
module SprocketsGzipExt
  def compress(file, _target)
    archiver.call(file, source, 0)
    nil
  end

  Sprockets::Utils::Gzip.prepend self
end
