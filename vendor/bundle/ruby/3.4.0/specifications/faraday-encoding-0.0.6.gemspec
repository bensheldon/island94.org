# -*- encoding: utf-8 -*-
# stub: faraday-encoding 0.0.6 ruby lib

Gem::Specification.new do |s|
  s.name = "faraday-encoding".freeze
  s.version = "0.0.6".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Takayuki Matsubara".freeze]
  s.date = "2024-08-02"
  s.description = "A Faraday Middleware sets body encoding when specified by server.".freeze
  s.email = ["takayuki.1229@gmail.com".freeze]
  s.homepage = "https://github.com/ma2gedev/faraday-encoding".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.5.3".freeze
  s.summary = "A Faraday Middleware sets body encoding when specified by server.".freeze

  s.installed_by_version = "3.6.2".freeze

  s.specification_version = 4

  s.add_development_dependency(%q<rake>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<rspec>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<faraday_middleware>.freeze, ["~> 0.10".freeze])
  s.add_runtime_dependency(%q<faraday>.freeze, [">= 0".freeze])
end
