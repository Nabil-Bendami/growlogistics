import { language } from '../i18n/index.js'
import './LanguageSwitch.css'

export default function LanguageSwitch() {
  const href = code => {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', code)
    return `${url.pathname}${url.search}${url.hash}`
  }
  return <nav className="language-switch" aria-label={language === 'en' ? 'Website language' : 'Langue du site'}>
    {['fr', 'en'].map(code => <a key={code} href={href(code)} lang={code} hrefLang={code} aria-label={code === 'fr' ? 'Français' : 'English'} aria-current={code === language ? 'true' : undefined}>{code.toUpperCase()}</a>)}
  </nav>
}
