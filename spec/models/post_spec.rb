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
end
