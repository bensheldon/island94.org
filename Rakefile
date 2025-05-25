# frozen_string_literal: true
require File.expand_path('config/application', __dir__)
Rails.application.load_tasks

desc 'Create a new post'
task :new_post, [:title, :body] => :environment do |_t, args|
  ENV["TZ"] = 'America/Los_Angeles'

  title = args[:title] || ENV['POST_TITLE'] || raise("Title cannot be empty")
  body = args[:content] || ENV.fetch('POST_BODY', nil)

  content = <<~MARKDOWN
    ---
    title: #{title.to_json}
    date: #{Time.zone.now.strftime('%Y-%m-%d %H:%M %Z')}
    published: true
    tags: []
    ---

    #{body}

    <blockquote markdown="1">



    </blockquote>
  MARKDOWN

  filename = "#{Time.zone.now.strftime('%Y-%m-%d')}-#{title.parameterize}.md"
  path = File.join("_posts", filename)
  File.write(path, content)

  $stdout.puts "=== Generating post ==="
  $stdout.puts path
end

desc 'Create a new book review'
task :new_book, [:title, :author, :link, :rating, :review] => :environment do |_t, args|
  ENV["TZ"] = 'America/Los_Angeles'

  title = args[:title] || ENV.fetch('BOOK_TITLE', nil)
  author = args[:author] || ENV.fetch('BOOK_AUTHOR', nil)
  link = args[:link] || ENV.fetch('BOOK_LINK', nil)
  rating = args[:rating] || ENV.fetch('BOOK_RATING', nil)
  review = args[:review] || ENV.fetch('BOOK_REVIEW', nil)

  raise "Title cannot be empty" if title.nil?

  content = <<~MARKDOWN
    ---
    title: #{title.to_json}
    author: "#{author}"
    link: "#{link}"
    rating: #{rating}
    date: #{Time.zone.now.strftime('%Y-%m-%d %H:%M %Z')}
    published: true
    layout: book
    tags: []
    ---

    #{review}

    <blockquote markdown="1">



    </blockquote>
  MARKDOWN

  filename = "#{Time.zone.now.strftime('%Y-%m-%d')}-#{title.parameterize}.md"
  path = File.join("_posts", filename)
  File.write(path, content)

  $stdout.puts "=== Generating book review ==="
  $stdout.puts path
end
