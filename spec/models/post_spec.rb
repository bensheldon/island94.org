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
