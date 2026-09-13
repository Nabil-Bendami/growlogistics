import { useEffect } from 'react'

/*
 * Opening / closing / scroll choreography for a feature detail page.
 * Everything is progressive enhancement: without JS, or with reduced motion,
 * the page stays fully readable and navigation behaves normally.
 */
export default function useFeaturePageMotion(slug) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = document.documentElement
    let dispose = () => {}

    const setup = () => {
      dispose()
      root.classList.add('feature-page-active')
      if (media.matches) { root.classList.add('feature-open'); return }

      const cleanups = []

      /* 1 — Opening: the page unveils once, top to bottom. */
      const openFrame = requestAnimationFrame(() => root.classList.add('feature-open'))
      cleanups.push(() => cancelAnimationFrame(openFrame))

      /* 2 — Scroll: each block arrives when it reaches the viewport. */
      const targets = [...document.querySelectorAll('[data-reveal]')]
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      }, { threshold: .12, rootMargin: '0px 0px -6% 0px' })
      targets.forEach(target => {
        // Anything already on screen at load is handled by the opening sequence.
        const rect = target.getBoundingClientRect()
        if (rect.top < window.innerHeight * .92) { target.classList.add('is-revealed'); return }
        observer.observe(target)
      })
      cleanups.push(() => observer.disconnect())

      // Keyboard users must never land on a still-hidden block.
      const onFocus = event => event.target.closest('[data-reveal]')?.classList.add('is-revealed')
      document.addEventListener('focusin', onFocus)
      cleanups.push(() => document.removeEventListener('focusin', onFocus))

      /* 3 — Scroll: parallax drift on the hero wash.
         The reading-progress bar is already driven by useExtraMotion. */
      let frame = 0
      const onScroll = () => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          root.style.setProperty('--feature-drift', `${Math.min(window.scrollY * .14, 90)}px`)
        })
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) })

      /* 4 — Closing: play the exit, then let the browser navigate. */
      const onClick = event => {
        const link = event.target.closest('a[href]')
        if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey ||
            event.shiftKey || event.altKey || event.button !== 0) return
        const url = new URL(link.href, window.location.href)
        if (url.origin !== window.location.origin) return
        // Same-page anchors scroll; they must not trigger the exit.
        if (url.pathname === window.location.pathname && url.hash) return

        event.preventDefault()
        root.classList.add('feature-closing')
        const go = () => { window.location.href = url.href }
        const timer = setTimeout(go, 380)
        document.querySelector('.feature-page')?.addEventListener('animationend', () => {
          clearTimeout(timer); go()
        }, { once: true })
      }
      document.addEventListener('click', onClick)
      cleanups.push(() => document.removeEventListener('click', onClick))

      // A back/forward restore must not leave the page stuck mid-exit.
      const onShow = () => root.classList.remove('feature-closing')
      window.addEventListener('pageshow', onShow)
      cleanups.push(() => window.removeEventListener('pageshow', onShow))

      dispose = () => {
        cleanups.forEach(fn => fn())
        targets.forEach(target => target.classList.remove('is-revealed'))
      }
    }

    setup()
    media.addEventListener('change', setup)
    return () => {
      dispose()
      media.removeEventListener('change', setup)
      root.classList.remove('feature-page-active', 'feature-open', 'feature-closing')
      root.style.removeProperty('--feature-drift')
    }
  }, [slug])
}
