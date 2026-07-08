# frozen_string_literal: true
require_relative "../rails_helper"

RSpec.describe Bookmark do
  describe '.load_all' do
    it 'loads all bookmarks from _bookmarks directory' do
      result = described_class.all

      expect(result.size).to be > 1
      expect(result.first).to be_a(described_class)
    end
  end

  describe '#published?' do
    it 'is true when the frontmatter has no published key' do
      bookmark = described_class.new(frontmatter: {})
      expect(bookmark.published?).to be(true)
    end

    it 'is true when published is explicitly true' do
      bookmark = described_class.new(frontmatter: { "published" => true })
      expect(bookmark.published?).to be(true)
    end

    it 'is false when published is explicitly false' do
      bookmark = described_class.new(frontmatter: { "published" => false })
      expect(bookmark.published?).to be(false)
    end
  end

  describe '.published' do
    it 'excludes unpublished bookmarks' do
      published_bookmark = described_class.new(filepath: "#{Rails.root}/_bookmarks/2024/2024-01-01-published.md", frontmatter: { "published" => true })
      unpublished_bookmark = described_class.new(filepath: "#{Rails.root}/_bookmarks/2024/2024-01-01-unpublished.md", frontmatter: { "published" => false })
      allow(described_class).to receive(:all).and_return([published_bookmark, unpublished_bookmark])

      expect(described_class.published).to eq([published_bookmark])
    end
  end
end
