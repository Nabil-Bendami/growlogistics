import english from './en.json' with { type: 'json' }

function readLanguage() {
  if (typeof window === 'undefined') return 'fr'
  const requested = new URLSearchParams(window.location.search).get('lang')
  if (requested === 'en' || requested === 'fr') {
    try { window.localStorage.setItem('grow-language', requested) } catch { /* Storage may be disabled. */ }
    return requested
  }
  try { return window.localStorage.getItem('grow-language') === 'en' ? 'en' : 'fr' } catch { return 'fr' }
}

// Language switches reload the document, so module-level content and maps use
// the same locale as React from the first render.
export const language = readLanguage()
export const locale = language === 'en' ? 'en-US' : 'fr-FR'
export function t(french) {
  return language === 'en' ? (english[french] ?? french) : french
}
