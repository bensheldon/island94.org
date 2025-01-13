import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["switcher", "switcherText", "activeIcon"]
  static values = {
    theme: String
  }

  connect() {
    this.setTheme(this.#getPreferredTheme())
    this.#updateTheme()

    // Setup media query listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = this.#getStoredTheme()
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        this.setTheme(this.#getPreferredTheme())
      }
    })
  }

  // Actions
  switch(event) {
    const theme = event.currentTarget.getAttribute('data-bs-theme-value')
    this.#setStoredTheme(theme)
    this.setTheme(theme)
    this.#showActiveTheme(theme, true)
  }

  // Public method that can be called from other controllers if needed
  setTheme(theme) {
    if (theme === 'auto') {
      document.documentElement.setAttribute(
        'data-bs-theme',
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      )
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  // Private methods
  #getStoredTheme() {
    return localStorage.getItem('theme')
  }

  #setStoredTheme(theme) {
    localStorage.setItem('theme', theme)
  }

  #getPreferredTheme() {
    const storedTheme = this.#getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  #showActiveTheme(theme, focus = false) {
    if (!this.hasSwitcherTarget) return

    const btnToActive = this.element.querySelector(`[data-bs-theme-value="${theme}"]`)
    const iconOfActiveBtn = btnToActive.querySelector('i')

    // Reset all buttons
    this.element.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    // Set active button
    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')

    // Update active icon
    this.activeIconTarget.setAttribute('class', iconOfActiveBtn.getAttribute('class'))

    // Update aria label
    const themeSwitcherLabel = `${this.switcherTextTarget.textContent} (${btnToActive.dataset.bsThemeValue})`
    this.switcherTarget.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      this.switcherTarget.focus()
    }
  }

  #updateTheme() {
    this.#showActiveTheme(this.#getPreferredTheme())
  }
}
