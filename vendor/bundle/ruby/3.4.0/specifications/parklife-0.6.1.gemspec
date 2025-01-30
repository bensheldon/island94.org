# -*- encoding: utf-8 -*-
# stub: parklife 0.6.1 ruby lib

Gem::Specification.new do |s|
  s.name = "parklife".freeze
  s.version = "0.6.1".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "changelog_uri" => "https://github.com/benpickles/parklife/blob/main/CHANGELOG.md", "homepage_uri" => "https://parklife.dev", "rubygems_mfa_required" => "true", "source_code_uri" => "https://github.com/benpickles/parklife" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["Ben Pickles".freeze]
  s.bindir = "exe".freeze
  s.date = "2024-08-23"
  s.email = ["spideryoung@gmail.com".freeze]
  s.executables = ["parklife".freeze]
  s.files = ["exe/parklife".freeze]
  s.homepage = "https://parklife.dev".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.5.0".freeze)
  s.rubygems_version = "3.5.17".freeze
  s.summary = "Convert a Rack app into a static HTML site.".freeze

  s.installed_by_version = "3.6.2".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<nokogiri>.freeze, [">= 0".freeze])
  s.add_runtime_dependency(%q<rack-test>.freeze, [">= 0".freeze])
  s.add_runtime_dependency(%q<thor>.freeze, [">= 0".freeze])
end
