# frozen_string_literal: true
require_relative "../rails_helper"

RSpec.describe Post do
  describe '.load_all' do
    it 'loads all posts from _posts directory' do
      result = described_class.all

      expect(result.size).to be > 1
      expect(result.first).to be_a(described_class)
      expect(result.first.title).to eq("Pool Soup")
    end
  end

  describe '#content' do
    it 'executes xruby code blocks and annotates `# =>` comments with their values' do
      body = <<~MARKDOWN
        ```xruby
        x = 1 + 2
        @y = x # =>
        ```

        ```xruby
        @y += 1
        @y #=>
        ```

        ```xruby
        class Greeter
          def hello = "hello"
        end
        ```

        ```xruby
        Greeter.new.hello # =>
        Greeter.new.class.name # =>
        Greeter # =>
        Greeter.name # =>
        ```
      MARKDOWN

      with_temporary_post(filename: "2026-01-01-xruby-test-post.md", body: body) do |post|
        expect(post.content).to include('class="language-ruby highlighter-rouge"')
        expect(post.content).to include("# =&gt; 3")
        expect(post.content).to include("#=&gt; 4")
        expect(post.content).to include('# =&gt; "hello"')
        expect(post.content).to include("# =&gt; Greeter")
        expect(post.content).to include('# =&gt; "Greeter"')
      end
    end
  end

  describe '#published?' do
    it 'is true when the frontmatter has no published key' do
      post = described_class.new(frontmatter: {})
      expect(post.published?).to be(true)
    end

    it 'is true when published is explicitly true' do
      post = described_class.new(frontmatter: { "published" => true })
      expect(post.published?).to be(true)
    end

    it 'is false when published is explicitly false' do
      post = described_class.new(frontmatter: { "published" => false })
      expect(post.published?).to be(false)
    end
  end

  describe '.published' do
    it 'excludes unpublished posts' do
      published_post = described_class.new(filepath: "#{Rails.root}/_posts/2024-01-01-published.md", frontmatter: { "published" => true })
      unpublished_post = described_class.new(filepath: "#{Rails.root}/_posts/2024-01-01-unpublished.md", frontmatter: { "published" => false })
      allow(described_class).to receive(:all).and_return([published_post, unpublished_post])

      expect(described_class.published).to eq([published_post])
    end
  end
end
