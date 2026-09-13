import { useEffect, useRef, useState } from 'react'

/* Brand palette, mirrored from palette.css so the scene matches the page. */
const COBALT = 0x2457ff
const DEEP_NAVY = 0x111c44
const PALE_SKY = 0xd8e3ff

/* Where the network nodes sit, as [latitude, longitude] in degrees. */
const NODES = [
  [33.6, -7.6], [48.9, 2.4], [51.5, -0.1], [40.4, -3.7], [25.2, 55.3],
  [1.3, 103.8], [31.2, 121.5], [-33.9, 18.4], [40.7, -74.0], [-23.5, -46.6],
  [35.7, 139.7], [19.4, -99.1],
]
/* Routes drawn between those nodes, by index. */
const ROUTES = [[0, 1], [0, 7], [0, 8], [1, 2], [1, 4], [4, 5], [5, 6], [6, 10], [8, 11], [8, 9], [3, 0], [5, 4]]

const RADIUS = 2.35

export default function AboutScene() {
  const mount = useRef(null)
  const [state, setState] = useState('idle') // idle → live | fallback

  useEffect(() => {
    const host = mount.current
    if (!host) return

    let disposed = false
    let cleanup = () => {}

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      start()
    }, { threshold: .15 })
    observer.observe(host)

    async function start() {
      // No WebGL (old browser, blocked context) → keep the photo fallback.
      const probe = document.createElement('canvas')
      if (!probe.getContext('webgl2') && !probe.getContext('webgl')) { setState('fallback'); return }

      let THREE
      try { THREE = await import('three') } catch { setState('fallback'); return }
      if (disposed) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
      camera.position.set(0, 1.6, 9.2)
      camera.lookAt(0, 0, 0)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      host.appendChild(renderer.domElement)

      const world = new THREE.Group()
      world.rotation.z = -0.28 // A slight axial tilt reads better than dead upright.
      scene.add(world)

      /* Lat/lon → a point on the sphere. */
      const toVector = (lat, lon, radius = RADIUS) => {
        const phi = (90 - lat) * Math.PI / 180
        const theta = (lon + 180) * Math.PI / 180
        return new THREE.Vector3(
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta),
        )
      }

      /* --- 1. The globe: a fine wireframe, no solid shading. --- */
      const shell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(RADIUS, 4),
        new THREE.MeshBasicMaterial({ color: PALE_SKY, wireframe: true, transparent: true, opacity: .34 }),
      )
      world.add(shell)

      // A barely-there solid core so routes behind the globe read as occluded.
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * .985, 48, 32),
        new THREE.MeshBasicMaterial({ color: 0xf3f6ff, transparent: true, opacity: .82 }),
      )
      world.add(core)

      /* --- 2. Latitude rings, thinning toward the poles. --- */
      const ringMat = new THREE.LineBasicMaterial({ color: COBALT, transparent: true, opacity: .16 })
      for (let i = 1; i < 8; i++) {
        const lat = -90 + i * 22.5
        const r = RADIUS * Math.cos(lat * Math.PI / 180)
        const y = RADIUS * Math.sin(lat * Math.PI / 180)
        const points = []
        for (let a = 0; a <= 64; a++) {
          const t = (a / 64) * Math.PI * 2
          points.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r))
        }
        world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ringMat))
      }

      /* --- 3. Trade routes: arcs lifted off the surface. --- */
      const arcs = []
      for (const [from, to] of ROUTES) {
        const a = toVector(...NODES[from])
        const b = toVector(...NODES[to])
        // Lift the midpoint by how far apart the endpoints are.
        const mid = a.clone().add(b).multiplyScalar(.5)
        const lift = 1 + a.distanceTo(b) * .28
        mid.normalize().multiplyScalar(RADIUS * lift)
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
        const points = curve.getPoints(72)

        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({ color: COBALT, transparent: true, opacity: .5 })
        const line = new THREE.Line(geometry, material)
        // Drawn progressively in the loop, so each route traces itself.
        geometry.setDrawRange(0, 0)
        world.add(line)

        /* A pulse that rides the arc. */
        const pulse = new THREE.Mesh(
          new THREE.SphereGeometry(.055, 12, 12),
          new THREE.MeshBasicMaterial({ color: DEEP_NAVY }),
        )
        world.add(pulse)

        arcs.push({ curve, geometry, pulse, total: points.length, offset: Math.random(), speed: .1 + Math.random() * .1 })
      }

      /* --- 4. Nodes: a dot plus a halo at each hub. --- */
      const halos = []
      const nodeGeo = new THREE.SphereGeometry(.062, 14, 14)
      const nodeMat = new THREE.MeshBasicMaterial({ color: COBALT })
      const haloGeo = new THREE.RingGeometry(.1, .13, 24)
      for (const [lat, lon] of NODES) {
        const position = toVector(lat, lon)
        const dot = new THREE.Mesh(nodeGeo, nodeMat)
        dot.position.copy(position)
        world.add(dot)

        const halo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({
          color: COBALT, transparent: true, opacity: .5, side: THREE.DoubleSide,
        }))
        halo.position.copy(position)
        halo.lookAt(0, 0, 0) // Lie flat against the surface.
        halo.userData.phase = Math.random() * Math.PI * 2
        world.add(halo)
        halos.push(halo)
      }

      /* --- 5. An outer shell of drifting motes for depth. --- */
      const count = 260
      const positions = new Float32Array(count * 3)
      const seeds = []
      for (let i = 0; i < count; i++) {
        const r = RADIUS * (1.35 + Math.random() * .75)
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        seeds.push({ r, theta, phi, speed: .02 + Math.random() * .05 })
        positions.set([
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ], i * 3)
      }
      const dustGeo = new THREE.BufferGeometry()
      dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
        color: COBALT, size: .045, transparent: true, opacity: .55, sizeAttenuation: true,
      }))
      scene.add(dust)

      /* --- Interaction: the globe leans toward the pointer. --- */
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
      const onMove = event => {
        if (!fine.matches) return
        const rect = host.getBoundingClientRect()
        pointer.tx = ((event.clientX - rect.left) / rect.width - .5) * 2
        pointer.ty = ((event.clientY - rect.top) / rect.height - .5) * 2
      }
      const onLeave = () => { pointer.tx = 0; pointer.ty = 0 }
      host.addEventListener('pointermove', onMove)
      host.addEventListener('pointerleave', onLeave)

      /* --- Scroll: a gentle drift as the section passes. --- */
      let scrollLean = 0
      const onScroll = () => {
        const rect = host.getBoundingClientRect()
        const middle = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
        scrollLean = Math.max(-1, Math.min(1, middle))
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })

      const resize = () => {
        const size = Math.max(host.clientWidth, 1)
        renderer.setSize(size, size, false)
        camera.aspect = 1
        camera.updateProjectionMatrix()
      }
      resize()
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(host)

      const clock = new THREE.Clock()
      let running = true
      let raf = 0

      const frame = () => {
        raf = requestAnimationFrame(frame)
        const time = clock.getElapsedTime()
        const still = reduced.matches

        pointer.x += (pointer.tx - pointer.x) * .05
        pointer.y += (pointer.ty - pointer.y) * .05

        world.rotation.y = (still ? .6 : time * .08) + pointer.x * .42
        world.rotation.x = pointer.y * .22 + scrollLean * .12
        world.position.y = still ? 0 : Math.sin(time * .55) * .05 - scrollLean * .3

        if (!still) {
          // Each arc draws itself, holds, then clears and starts over.
          for (const arc of arcs) {
            const cycle = (time * arc.speed + arc.offset) % 1
            const drawn = Math.min(cycle / .55, 1)
            arc.geometry.setDrawRange(0, Math.floor(drawn * arc.total))
            arc.geometry.attributes.position.needsUpdate = true

            if (cycle < .55) {
              arc.pulse.visible = true
              arc.pulse.position.copy(arc.curve.getPoint(drawn))
              const fade = Math.min(drawn * 6, 1) * Math.min((1 - drawn) * 6, 1)
              arc.pulse.scale.setScalar(.7 + fade * .8)
            } else {
              arc.pulse.visible = false
            }
          }

          // Hubs breathe out of phase with each other.
          for (const halo of halos) {
            const beat = (Math.sin(time * 1.5 + halo.userData.phase) + 1) / 2
            halo.scale.setScalar(1 + beat * .7)
            halo.material.opacity = .12 + (1 - beat) * .4
          }

          // The dust shell turns slowly against the globe.
          const array = dustGeo.attributes.position.array
          for (let i = 0; i < count; i++) {
            const seed = seeds[i]
            const theta = seed.theta + time * seed.speed
            array[i * 3] = seed.r * Math.sin(seed.phi) * Math.cos(theta)
            array[i * 3 + 2] = seed.r * Math.sin(seed.phi) * Math.sin(theta)
          }
          dustGeo.attributes.position.needsUpdate = true
          dust.rotation.y = -time * .015
        } else {
          for (const arc of arcs) {
            arc.geometry.setDrawRange(0, arc.total)
            arc.geometry.attributes.position.needsUpdate = true
            arc.pulse.visible = false
          }
        }

        renderer.render(scene, camera)
      }

      const visibility = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !running) { running = true; clock.start(); raf = requestAnimationFrame(frame) }
        else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf); clock.stop() }
      }, { threshold: 0 })
      visibility.observe(host)

      raf = requestAnimationFrame(frame)
      setState('live')

      cleanup = () => {
        cancelAnimationFrame(raf)
        visibility.disconnect()
        resizeObserver.disconnect()
        window.removeEventListener('scroll', onScroll)
        host.removeEventListener('pointermove', onMove)
        host.removeEventListener('pointerleave', onLeave)
        scene.traverse(node => {
          node.geometry?.dispose()
          if (Array.isArray(node.material)) node.material.forEach(m => m.dispose())
          else node.material?.dispose()
        })
        world.traverse(node => {
          node.geometry?.dispose()
          if (Array.isArray(node.material)) node.material.forEach(m => m.dispose())
          else node.material?.dispose()
        })
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    return () => { disposed = true; observer.disconnect(); cleanup() }
  }, [])

  return <div className={`about-scene state-${state}`}>
    <div className="about-scene-canvas" ref={mount} role="img"
      aria-label="Animation : un globe filaire parcouru de routes lumineuses reliant les hubs logistiques."/>
    {state !== 'live' && <img className="about-scene-fallback" src="/assets/transit-about.png"
      alt="Porte-conteneurs en mer" width="1116" height="1059" loading="lazy"/>}
  </div>
}
