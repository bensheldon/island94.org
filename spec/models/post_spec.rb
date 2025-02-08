require_relative "../rails_helper"

RSpec.describe Post, type: :model do
  describe '.load_all' do
    it 'loads all posts from _posts directory' do
      result = Post.all

      expect(result.size).to be > 1
      expect(result.first).to be_a(Post)
      expect(result.first.title).to eq("Pool Soup")
    end
  end

  describe '.create' do
    include ActiveSupport::Testing::TimeHelpers

    it "creates a new post" do
      date = Time.zone.local(2024, 1, 1)

      record = travel_to(date) do
        described_class.create title: "Test \"Test\" Test ", body: "This is test", frontmatter: { tags: ["test"] }
      end

      expect(record.filepath).to eq Rails.root.join("_posts/01-01-2024-test-test-test.md").to_s
      expect(record.title).to eq("Test \"Test\" Test ")
      expect(record.body).to eq("This is test")
      expect(record.tags).to eq(["test"])
      expect(record.slug).to eq("test-test-test")
      expect(record.published_at).to be_within(1.minute).of(date)
    ensure
      File.delete(record.filepath)
    end
  end
end
