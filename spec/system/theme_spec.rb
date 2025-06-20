# frozen_string_literal: true
require 'rails_helper'

RSpec.describe 'Bootstrap color mode theme', :js do
  it 'can change the theme' do
    visit "/"
    expect(page).to have_css 'html[data-bs-theme="light"]'

    click_on "Theme"
    click_on "Dark"
    expect(page).to have_css 'html[data-bs-theme="dark"]'

    visit "/"
    expect(page).to have_css 'html[data-bs-theme="dark"]'
  end
end
