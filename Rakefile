# frozen_string_literal: true
require File.expand_path('config/application', __dir__)
Rails.application.load_tasks

desc 'Create a new post'
task :new_post, [:title, :body] => :environment do |_t, args|
  ENV["TZ"] = 'America/Los_Angeles'

  title = args[:title] || ENV['POST_TITLE'] || raise("Title cannot be empty")
  body = args[:body] || ENV.fetch('POST_BODY', nil)

  post = Post.create!(title: title, body: body)

  $stdout.puts "=== Generating post ==="
  $stdout.puts post.project_filepath
end

desc 'Create a new bookmark'
task :new_bookmark, [:link, :title, :tags, :notes] => :environment do |_t, args|
  ENV["TZ"] = 'America/Los_Angeles'

  link = (args[:link] || ENV.fetch('BOOKMARK_LINK', nil)).to_s.strip
  raise "Link cannot be empty" if link.empty?

  title = (args[:title] || ENV.fetch('BOOKMARK_TITLE', nil)).presence
  tags = (args[:tags] || ENV.fetch('BOOKMARK_TAGS', nil)).to_s.split(",").map(&:strip).reject(&:empty?)

  notes = args[:notes] || ENV.fetch('BOOKMARK_NOTES', nil)
  notes = $stdin.read.strip if notes.blank? && $stdin.stat.pipe?

  if title.blank?
    require 'metainspector'
    begin
      title = MetaInspector.new(link).best_title
    rescue StandardError => e
      warn "Failed to fetch title: #{e.message}"
    end
  end

  bookmark = Bookmark.create!(link: link, title: title, tags: tags, notes: notes)

  $stdout.puts "=== Generating bookmark ==="
  $stdout.puts bookmark.project_filepath
end
