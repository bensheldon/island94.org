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
end
