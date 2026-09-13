import { useEffect, useState } from 'react'
import useFeaturePageMotion from '../hooks/useFeaturePageMotion.js'
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from 'lucide-react'
import { featureDetails } from '../data/featureDetails.js'
import './FeaturePage.css'

export default function FeaturePage({ feature }) {
  const [active, setActive] = useState(0)
  const step = feature.steps[active]
  useFeaturePageMotion(feature.slug)
  useEffect(() => {
    document.title = `${feature.title} — Grow Logistics`
    document.querySelector('meta[name="description"]')?.setAttribute('content', feature.intro)
  }, [feature])
  return <div className="feature-page">
    <header className="feature-page-nav wrap"><a href="/" className="feature-page-brand">Grow <span>LOGISTICS</span></a><a href="/#fonctionnalites"><ArrowLeft size={17}/> Toutes les fonctionnalités</a></header>
    <main>
      <section className="feature-page-hero wrap">
        <div className="eyebrow" style={{'--open-index':0}}><span/> {feature.product} · Fonctionnalité</div>
        <h1 style={{'--open-index':1}}>{feature.title}</h1>
        <p style={{'--open-index':2}}>{feature.intro}</p>
        <div className="feature-page-audience" style={{'--open-index':3}}>Pour {feature.audience.toLocaleLowerCase('fr')}</div>
        <a href="#deroulement" className="btn btn-primary" style={{'--open-index':4}}>Comprendre le fonctionnement <ArrowRight size={18}/></a>
      </section>
      <section className="feature-page-flow wrap" id="deroulement" aria-labelledby="flow-title">
        <div className="section-head" data-reveal><div className="eyebrow"><span/> Pas à pas</div><h2 id="flow-title">Ce qui se passe, concrètement.</h2><p>Sélectionnez une étape pour découvrir son rôle dans vos opérations.</p></div>
        <div className="feature-flow-grid">
          <ol className="feature-step-list">{feature.steps.map(([title, description], index) => <li key={title} data-reveal style={{'--reveal-index':index}}>
            <button onClick={() => setActive(index)} aria-pressed={active === index} aria-controls="feature-step-preview" className={active === index ? 'active' : ''}>
              <span className="feature-step-number">0{index + 1}</span><span><strong>{title}</strong><span>{description}</span></span><ArrowRight size={20}/>
            </button>
          </li>)}</ol>
          <div className="feature-preview" id="feature-step-preview" data-reveal aria-live="polite" aria-atomic="true">
            <div className="feature-preview-top"><span>{feature.product}</span><small>Exemple de déroulement</small></div>
            <div className="feature-preview-content" key={active}><span className="feature-preview-count">0{active + 1} <small>/ 04</small></span>
            <h3>{step[2]}</h3><ul>{step[3].map((item, index) => <li key={item} style={{'--check-index':index}}><CheckCircle2 size={21}/>{item}</li>)}</ul></div>
            <div className="feature-preview-progress" aria-hidden="true">{feature.steps.map((item, index) => <span key={item[0]} className={index <= active ? 'active' : ''}/>)}</div>
            <button className="text-link" onClick={() => setActive((active + 1) % feature.steps.length)}>{active === 3 ? 'Revoir le déroulement' : 'Étape suivante'} <ArrowRight size={18}/></button>
          </div>
        </div>
      </section>
      <section className="feature-outcome" data-reveal><div className="wrap"><Check size={34}/><div><div className="eyebrow">À l’arrivée</div><h2>{feature.result}</h2></div><a href="/#contact" className="btn btn-primary">Parlons de votre projet <ArrowRight size={18}/></a></div></section>
      <nav className="wrap feature-related" aria-label="Autres fonctionnalités"><h2 data-reveal>Découvrez aussi</h2><div>{featureDetails.filter(item => item.slug !== feature.slug).map((item, index) => <a key={item.slug} href={`/fonctionnalites/${item.slug}`} data-reveal style={{'--reveal-index':index}}><small>{item.product}</small><span>{item.title}</span><ArrowRight size={18}/></a>)}</div></nav>
    </main>
    <footer className="feature-page-footer wrap" data-reveal><span>© 2026 Grow Logistics</span><a href="/">Retour à l’accueil <ArrowRight size={16}/></a></footer>
  </div>
}
