import { useEffect, useMemo, useState } from 'react'

type Tab = 'home' | 'explore' | 'alerts' | 'saved' | 'profile'
type Screen = Tab | 'planner' | 'results' | 'details' | 'terminal'

type Route = {
  id: number
  title: string
  time: string
  fare: string
  walk: string
  tags: string[]
  note: string
}

const routes: Route[] = [
  {
    id: 1,
    title: 'Fastest route',
    time: '1 hr 18 min',
    fare: '₱70–₱86',
    walk: '8 min walk',
    tags: ['JEEP', 'BUS', 'JEEP'],
    note: 'Best balance of travel time and transfers',
  },
  {
    id: 2,
    title: 'Fewer transfers',
    time: '1 hr 31 min',
    fare: '₱62–₱78',
    walk: '12 min walk',
    tags: ['BUS', 'JEEP'],
    note: 'A simpler trip with only one transfer',
  },
  {
    id: 3,
    title: 'Lowest estimated fare',
    time: '1 hr 42 min',
    fare: '₱54–₱66',
    walk: '16 min walk',
    tags: ['JEEP', 'JEEP', 'JEEP'],
    note: 'Takes longer, but may save up to ₱20',
  },
]

const terminals = [
  { name: 'SM City Dasmariñas', area: 'Dasmariñas', modes: ['JEEP', 'BUS', 'UV'], x: 38, y: 52 },
  { name: 'Pala-Pala Terminal', area: 'Dasmariñas', modes: ['JEEP', 'BUS'], x: 49, y: 60 },
  { name: 'District Imus', area: 'Imus', modes: ['JEEP', 'UV'], x: 45, y: 30 },
  { name: 'Trece Martires Terminal', area: 'Trece Martires', modes: ['JEEP', 'BUS'], x: 22, y: 48 },
]

const navItems: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'explore', label: 'Explore', icon: 'map' },
  { id: 'alerts', label: 'Alerts', icon: 'bell' },
  { id: 'saved', label: 'Saved', icon: 'bookmark' },
  { id: 'profile', label: 'Profile', icon: 'user' },
]

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c.7-4.2 3.4-6 8-6s7.3 1.8 8 6"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    swap: <><path d="M7 7h12l-3-3M17 17H5l3 3"/></>,
    arrow: <><path d="m9 18 6-6-6-6"/></>,
    back: <><path d="m15 18-6-6 6-6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    walk: <><circle cx="13" cy="4" r="2"/><path d="m10 21 2-7-3-3 2-4 4 3 3 1M14 14l4 7"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    locate: <><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <path d="M5 12h14"/>,
    shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6Z"/><path d="m9 12 2 2 4-4"/></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Header({ title, onBack, action }: { title: string; onBack?: () => void; action?: React.ReactNode }) {
  return (
    <header className="page-header">
      {onBack ? <button className="icon-button" onClick={onBack} aria-label="Go back"><Icon name="back" /></button> : <span className="header-spacer" />}
      <h1>{title}</h1>
      <span className="header-action">{action}</span>
    </header>
  )
}

function RideTag({ children }: { children: string }) {
  const type = children.toLowerCase()
  return <span className={`ride-tag ${type}`}>{children}</span>
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navItems.map(item => (
        <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => onChange(item.id)}>
          <span className="nav-icon"><Icon name={item.icon} size={21} />{item.id === 'alerts' && <i />}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

function App() {
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('cavite-onboarded') === 'yes')
  const [screen, setScreen] = useState<Screen>('home')
  const [previous, setPrevious] = useState<Screen>('home')
  const [from, setFrom] = useState('District Imus')
  const [to, setTo] = useState('SM City Dasmariñas')
  const [selectedRoute, setSelectedRoute] = useState(routes[0])
  const [saved, setSaved] = useState<number[]>(() => JSON.parse(localStorage.getItem('cavite-saved') || '[]'))
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('cavite-saved', JSON.stringify(saved)), [saved])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const go = (next: Screen) => {
    setPrevious(screen)
    setScreen(next)
  }
  const tab: Tab = ['home', 'explore', 'alerts', 'saved', 'profile'].includes(screen) ? screen as Tab : 'home'

  if (!onboarded) {
    return (
      <main className="app-shell onboarding">
        <section className="onboarding-art">
          <div className="sun" />
          <div className="road-line road-one" />
          <div className="road-line road-two" />
          <div className="jeepney">
            <div className="jeep-top">CAVITE</div>
            <div className="jeep-window"><span /><span /><span /></div>
            <div className="jeep-body"><i /><b>LAKBAY</b><i /></div>
            <div className="wheels"><span /><span /></div>
          </div>
        </section>
        <section className="onboarding-copy">
          <span className="eyebrow">YOUR EVERYDAY COMMUTE COMPANION</span>
          <h1>Get around Cavite<br />with confidence.</h1>
          <p>Plan jeep, bus and UV trips with clear transfers, fare estimates and local terminal guides.</p>
          <button className="primary-button" onClick={() => {
            localStorage.setItem('cavite-onboarded', 'yes')
            setOnboarded(true)
          }}>Start exploring <Icon name="arrow" size={20} /></button>
          <small>Sample routes for planning only. Always confirm with drivers.</small>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <div className="safe-top" />
      <div className="screen">
        {screen === 'home' && <Home from={from} to={to} onPlan={() => go('planner')} onQuick={(a, b) => { setFrom(a); setTo(b); go('results') }} />}
        {screen === 'planner' && <Planner from={from} to={to} setFrom={setFrom} setTo={setTo} onBack={() => setScreen(previous)} onSearch={() => go('results')} />}
        {screen === 'results' && <Results from={from} to={to} onBack={() => go('planner')} onSelect={route => { setSelectedRoute(route); go('details') }} />}
        {screen === 'details' && <Details route={selectedRoute} from={from} to={to} saved={saved.includes(selectedRoute.id)} onBack={() => setScreen('results')} onSave={() => {
          setSaved(items => items.includes(selectedRoute.id) ? items.filter(id => id !== selectedRoute.id) : [...items, selectedRoute.id])
          setToast(saved.includes(selectedRoute.id) ? 'Removed from saved journeys' : 'Journey saved on this phone')
        }} />}
        {screen === 'explore' && <Explore onTerminal={() => go('terminal')} onPlan={(place) => { setTo(place); go('planner') }} />}
        {screen === 'terminal' && <Terminal onBack={() => setScreen('explore')} onPlan={() => { setFrom('Pala-Pala Terminal'); go('planner') }} />}
        {screen === 'alerts' && <Alerts />}
        {screen === 'saved' && <Saved saved={saved} onOpen={(route) => { setSelectedRoute(route); go('details') }} onPlan={() => go('planner')} />}
        {screen === 'profile' && <Profile onReset={() => {
          localStorage.clear()
          setSaved([])
          setOnboarded(false)
          setScreen('home')
        }} />}
      </div>
      {['home', 'explore', 'alerts', 'saved', 'profile'].includes(screen) && <BottomNav active={tab} onChange={setScreen} />}
      {toast && <div className="toast"><Icon name="check" size={17} />{toast}</div>}
    </main>
  )
}

function Home({ from, to, onPlan, onQuick }: { from: string; to: string; onPlan: () => void; onQuick: (a: string, b: string) => void }) {
  return (
    <div className="home-screen">
      <section className="home-hero">
        <div className="brand-row">
          <div className="brand-mark">LC</div>
          <div><span>Lakbay</span><b>CAVITE</b></div>
          <button className="avatar">AM</button>
        </div>
        <p className="greeting">MAGANDANG UMAGA</p>
        <h1>Saan ang punta<br />natin ngayon?</h1>
        <button className="trip-card" onClick={onPlan}>
          <span className="trip-dots"><i /><b /><i /></span>
          <span className="trip-locations">
            <small>FROM</small><strong>{from}</strong>
            <em />
            <small>TO</small><strong>{to}</strong>
          </span>
          <span className="trip-arrow"><Icon name="arrow" /></span>
        </button>
      </section>
      <section className="home-content">
        <div className="notice">
          <span><Icon name="bell" size={20} /></span>
          <div><b>Traffic update</b><p>Moderate traffic along Aguinaldo Highway near Imus.</p></div>
          <Icon name="arrow" size={18} />
        </div>
        <div className="section-title"><div><span>QUICK TRIPS</span><h2>Popular routes</h2></div><button>View all</button></div>
        <div className="quick-grid">
          <button onClick={() => onQuick('District Imus', 'PITX')}>
            <span className="route-illustration"><i>IMUS</i><b>→</b><i>PITX</i></span>
            <strong>Imus to PITX</strong><small>From 55 min · ₱40–₱55</small>
          </button>
          <button onClick={() => onQuick('Dasmariñas', 'Alabang')}>
            <span className="route-illustration green"><i>DASMA</i><b>→</b><i>ALABANG</i></span>
            <strong>Dasma to Alabang</strong><small>From 1 hr · ₱55–₱70</small>
          </button>
        </div>
        <button className="all-terminals"><span><Icon name="pin" /></span><div><b>Find a terminal</b><small>Browse nearby stops and routes</small></div><Icon name="arrow" /></button>
      </section>
    </div>
  )
}

function Planner({ from, to, setFrom, setTo, onBack, onSearch }: { from: string; to: string; setFrom: (s: string) => void; setTo: (s: string) => void; onBack: () => void; onSearch: () => void }) {
  const [walk, setWalk] = useState(10)
  const places = ['District Imus', 'SM City Dasmariñas', 'Pala-Pala Terminal', 'PITX', 'Trece Martires', 'Alabang']
  return (
    <div className="light-screen">
      <Header title="Plan a trip" onBack={onBack} />
      <div className="content planner">
        <div className="route-inputs">
          <span className="input-track"><i /><b /><i /></span>
          <label><small>STARTING POINT</small><select value={from} onChange={e => setFrom(e.target.value)}>{places.map(p => <option key={p}>{p}</option>)}</select></label>
          <label><small>DESTINATION</small><select value={to} onChange={e => setTo(e.target.value)}>{places.map(p => <option key={p}>{p}</option>)}</select></label>
          <button className="swap-button" onClick={() => { const old = from; setFrom(to); setTo(old) }}><Icon name="swap" /></button>
        </div>
        <button className="location-button"><Icon name="locate" size={19} /> Use my current location</button>
        <div className="option-block">
          <span className="block-label">PREFERENCES</span>
          <div className="preference-row"><div><b>Maximum walking</b><small>Per leg of your journey</small></div><strong>{walk} min</strong></div>
          <input aria-label="Maximum walking time" type="range" min="5" max="20" step="5" value={walk} onChange={e => setWalk(Number(e.target.value))} />
          <div className="range-labels"><span>5 min</span><span>20 min</span></div>
        </div>
        <div className="option-block">
          <span className="block-label">RIDE TYPES</span>
          <div className="chips"><button className="selected">All rides</button><button>Jeep</button><button>Bus</button><button>UV</button></div>
        </div>
      </div>
      <div className="sticky-action"><button className="primary-button" disabled={from === to} onClick={onSearch}><Icon name="search" size={19} /> Find routes</button></div>
    </div>
  )
}

function Results({ from, to, onBack, onSelect }: { from: string; to: string; onBack: () => void; onSelect: (r: Route) => void }) {
  const [sort, setSort] = useState('Fastest')
  return (
    <div className="light-screen">
      <Header title="Route options" onBack={onBack} />
      <div className="journey-summary"><div><small>FROM</small><b>{from}</b></div><Icon name="arrow" /><div><small>TO</small><b>{to}</b></div></div>
      <div className="sort-row">{['Fastest', 'Cheapest', 'Fewer rides'].map(x => <button key={x} className={sort === x ? 'active' : ''} onClick={() => setSort(x)}>{x}</button>)}</div>
      <div className="route-list">
        <p className="results-count"><b>3 routes found</b><span>Typical weekday estimates</span></p>
        {routes.map((route, index) => (
          <button className="route-card" key={route.id} onClick={() => onSelect(route)}>
            <div className="route-card-top"><div><small>{index === 0 ? 'RECOMMENDED' : route.title.toUpperCase()}</small><h2>{route.time}</h2></div><span className="fare">{route.fare}</span></div>
            <div className="tag-line">{route.tags.map((tag, i) => <span key={i}><RideTag>{tag}</RideTag>{i < route.tags.length - 1 && <i />}</span>)}</div>
            <p>{route.note}</p>
            <div className="route-meta"><span><Icon name="walk" size={16} />{route.walk}</span><span>{route.tags.length - 1} transfer{route.tags.length > 2 ? 's' : ''}</span><Icon name="arrow" size={18} /></div>
          </button>
        ))}
        <p className="disclaimer">Times and fares are estimates based on sample route data.</p>
      </div>
    </div>
  )
}

function Details({ route, from, to, saved, onBack, onSave }: { route: Route; from: string; to: string; saved: boolean; onBack: () => void; onSave: () => void }) {
  const steps = [
    { time: '8 min', title: `Walk to ${from} loading area`, detail: 'About 550 m', type: 'WALK' },
    { time: '28 min', title: 'Ride to Pala-Pala', detail: 'Ask for Pala-Pala / Robinsons Dasma', type: route.tags[0] },
    { time: '6 min', title: 'Transfer at Pala-Pala Terminal', detail: 'Cross toward the northbound loading bay', type: 'TRANSFER' },
    { time: '32 min', title: `Ride to ${to}`, detail: 'Tell the driver your destination before boarding', type: route.tags[1] || 'JEEP' },
    { time: '4 min', title: 'Walk to your destination', detail: 'About 280 m', type: 'WALK' },
  ]
  return (
    <div className="light-screen details">
      <Header title="Your route" onBack={onBack} action={<button className={`save-button ${saved ? 'saved' : ''}`} onClick={onSave}><Icon name="bookmark" size={20} /></button>} />
      <section className="route-overview">
        <span>ESTIMATED TRIP</span><h1>{route.time}</h1>
        <div><b>{route.fare}</b><small>Est. fare</small><b>{route.walk}</b><small>Walking</small></div>
      </section>
      <section className="step-list">
        <div className="direction-row"><div><i />{from}</div><Icon name="arrow" /><div><i />{to}</div></div>
        {steps.map((step, index) => (
          <div className="step" key={step.title}>
            <div className="timeline"><span className={step.type.toLowerCase()}>{step.type === 'WALK' ? <Icon name="walk" size={17} /> : index + 1}</span>{index < steps.length - 1 && <i />}</div>
            <div className="step-copy"><small>{step.time}</small><h3>{step.title}</h3><p>{step.detail}</p>{!['WALK', 'TRANSFER'].includes(step.type) && <RideTag>{step.type}</RideTag>}</div>
          </div>
        ))}
      </section>
      <div className="route-tip"><Icon name="shield" /><div><b>Before you ride</b><p>Routes can change. Confirm the signboard and fare with the driver.</p></div></div>
    </div>
  )
}

function Explore({ onTerminal, onPlan }: { onTerminal: () => void; onPlan: (name: string) => void }) {
  const [selected, setSelected] = useState<(typeof terminals)[0] | null>(null)
  return (
    <div className="map-screen">
      <div className="map-bg">
        <svg viewBox="0 0 100 130" preserveAspectRatio="none">
          <path className="district" d="M8 15 39 5l19 15 30 3 4 28-17 15 7 36-31 20-31-13 2-30L6 53Z" />
          <path className="road yellow" d="M30 8c10 25 13 47 20 63s15 34 31 48" />
          <path className="road blue" d="M89 25C65 41 61 57 49 70S25 88 16 106" />
          <path className="road green" d="M11 54c22 3 40 10 61 11" />
        </svg>
        {terminals.map(t => <button key={t.name} aria-label={t.name} onClick={() => setSelected(t)} className="map-pin" style={{ left: `${t.x}%`, top: `${t.y}%` }}><Icon name="pin" size={19} /></button>)}
      </div>
      <div className="map-controls">
        <button className="map-search"><Icon name="search" size={19} /><span>Where do you want to go?</span></button>
        <div className="map-chips"><button className="active">All rides</button><button>Jeep</button><button>Bus</button><button>UV</button></div>
      </div>
      <div className="zoom-controls"><button><Icon name="plus" /></button><button><Icon name="minus" /></button><button><Icon name="locate" /></button></div>
      {selected ? <div className="terminal-sheet">
        <button className="sheet-close" onClick={() => setSelected(null)}><Icon name="close" size={18} /></button>
        <span className="sheet-label">TERMINAL</span><h2>{selected.name}</h2><p>{selected.area} · {selected.modes.length} ride types</p>
        <div className="tag-line">{selected.modes.map(x => <RideTag key={x}>{x}</RideTag>)}</div>
        <div className="sheet-actions"><button onClick={onTerminal}>View details</button><button onClick={() => onPlan(selected.name)}>Go here</button></div>
      </div> : <div className="map-legend"><span><i className="jeep" />Jeep</span><span><i className="bus" />Bus</span><span><i className="uv" />UV</span><small>Sample map</small></div>}
    </div>
  )
}

function Terminal({ onBack, onPlan }: { onBack: () => void; onPlan: () => void }) {
  return (
    <div className="light-screen">
      <Header title="Terminal details" onBack={onBack} />
      <div className="terminal-hero"><div className="terminal-sign">PALA-PALA<br /><small>TRANSPORT TERMINAL</small></div></div>
      <div className="content terminal-content">
        <span className="block-label">DASMARIÑAS</span><h1>Pala-Pala Terminal</h1><p className="muted">A busy transfer point near Robinsons Dasmariñas and Aguinaldo Highway.</p>
        <button className="primary-button" onClick={onPlan}>Plan from here <Icon name="arrow" /></button>
        <h2>Routes from this terminal</h2>
        {['PITX via Aguinaldo Highway', 'Alabang via Daang Hari', 'Trece Martires Bayan'].map((x, i) => <div className="terminal-route" key={x}><RideTag>{i === 1 ? 'UV' : i === 2 ? 'JEEP' : 'BUS'}</RideTag><div><b>{x}</b><small>{i === 0 ? 'Every 10–15 min' : 'Every 15–25 min'} · 5:00 AM–10:00 PM</small></div><Icon name="arrow" /></div>)}
      </div>
    </div>
  )
}

function Alerts() {
  const [mode, setMode] = useState('Service alerts')
  return (
    <div className="light-screen">
      <Header title="Alerts & departures" />
      <div className="segmented"><button className={mode === 'Service alerts' ? 'active' : ''} onClick={() => setMode('Service alerts')}>Service alerts</button><button className={mode === 'Departures' ? 'active' : ''} onClick={() => setMode('Departures')}>Departures</button></div>
      <div className="content alerts-list">
        {mode === 'Service alerts' ? <>
          <div className="chips"><button className="selected">All</button><button>Imus</button><button>Dasmariñas</button></div>
          <Alert tone="amber" label="DELAY · IMUS" title="Slow traffic near Anabu" body="Allow 15–20 extra minutes for trips along Aguinaldo Highway." time="Updated 12 min ago" />
          <Alert tone="red" label="HEAVY TRAFFIC · DASMARIÑAS" title="Congestion near Pala-Pala" body="Northbound buses and jeeps are moving slowly near the intersection." time="Updated 35 min ago" />
          <Alert tone="blue" label="UPDATE · CAVITE CITY" title="Temporary loading area" body="Some PITX-bound buses are loading beside the public market today." time="Updated 1 hr ago" />
        </> : <>
          <div className="info-box">Typical frequencies only. Most routes don’t publish fixed timetables.</div>
          {['PITX via Aguinaldo Highway', 'Alabang via Daang Hari', 'Trece Martires Bayan'].map((x, i) => <div className="departure" key={x}><RideTag>{i === 1 ? 'UV' : 'BUS'}</RideTag><div><b>{x}</b><small>From Pala-Pala Terminal</small></div><strong>{i === 0 ? '10–15' : '15–25'} min</strong></div>)}
        </>}
      </div>
    </div>
  )
}

function Alert({ tone, label, title, body, time }: { tone: string; label: string; title: string; body: string; time: string }) {
  return <article className={`alert-card ${tone}`}><span>{label}</span><h2>{title}</h2><p>{body}</p><small>{time}</small></article>
}

function Saved({ saved, onOpen, onPlan }: { saved: number[]; onOpen: (r: Route) => void; onPlan: () => void }) {
  const savedRoutes = useMemo(() => routes.filter(r => saved.includes(r.id)), [saved])
  return (
    <div className="light-screen">
      <Header title="Saved" />
      <div className="segmented"><button className="active">Journeys ({savedRoutes.length})</button><button>Terminals</button></div>
      <div className="content saved-list">
        {savedRoutes.length ? savedRoutes.map(route => <button className="saved-card" key={route.id} onClick={() => onOpen(route)}><div><span>SAVED JOURNEY</span><h2>Imus to Dasmariñas</h2><p>{route.time} · {route.fare}</p><div className="tag-line">{route.tags.map((x, i) => <RideTag key={i}>{x}</RideTag>)}</div></div><Icon name="arrow" /></button>) : <div className="empty-state"><span><Icon name="bookmark" size={34} /></span><h2>No saved journeys yet</h2><p>Save a route to find it here, even when you’re offline.</p><button className="primary-button" onClick={onPlan}>Plan a trip</button></div>}
        <small className="local-note">Saved securely on this phone.</small>
      </div>
    </div>
  )
}

function Profile({ onReset }: { onReset: () => void }) {
  const [large, setLarge] = useState(false)
  return (
    <div className={`light-screen ${large ? 'large-text' : ''}`}>
      <Header title="Profile" />
      <div className="content profile-content">
        <section className="profile-card"><div className="avatar large">AM</div><div><h2>Alex Mendoza</h2><p>Usual area: Imus</p></div><button>Edit</button></section>
        <span className="block-label">COMMUTE PREFERENCES</span>
        <section className="settings-card">
          <div><span><Icon name="map" /></span><div><b>Ride types</b><small>Jeep, Bus and UV</small></div><Icon name="arrow" /></div>
          <div><span><Icon name="walk" /></span><div><b>Maximum walking</b><small>10 minutes per leg</small></div><Icon name="arrow" /></div>
        </section>
        <span className="block-label">SETTINGS</span>
        <section className="settings-card">
          <div><span><Icon name="bell" /></span><div><b>Alerts on Home</b><small>Show notices for Imus</small></div><button className="switch on"><i /></button></div>
          <div><span><Icon name="menu" /></span><div><b>Larger text</b><small>Bigger text across the app</small></div><button aria-label="Toggle larger text" className={`switch ${large ? 'on' : ''}`} onClick={() => setLarge(x => !x)}><i /></button></div>
          <div><span><Icon name="locate" /></span><div><b>Location</b><small>On · near District Imus</small></div><button className="text-button">Check</button></div>
        </section>
        <span className="block-label">HELP</span>
        <section className="settings-card"><div><span><Icon name="shield" /></span><div><b>How to read a route</b></div><Icon name="arrow" /></div><div><span><Icon name="menu" /></span><div><b>About our data</b><small>What’s sample vs. verified</small></div><Icon name="arrow" /></div></section>
        <button className="reset-button" onClick={onReset}>Reset app and onboarding</button>
        <small className="local-note">Lakbay Cavite · sample data build</small>
      </div>
    </div>
  )
}

export default App
