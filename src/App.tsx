import { useEffect, useMemo, useRef, useState } from 'react'

type MapPoint = {
  name: string
  area: string
  category: 'City services' | 'Shopping' | 'Barangay'
  address: string
  lat: number
  lng: number
}

type GoogleMapInstance = {
  setZoom: (zoom: number) => void
  getZoom: () => number | undefined
  panTo: (position: { lat: number; lng: number }) => void
}

type GoogleMarkerInstance = {
  map: GoogleMapInstance | null
  addListener: (event: string, listener: () => void) => void
}

type GoogleMapsApi = {
  maps: {
    importLibrary: (library: 'maps' | 'marker') => Promise<unknown>
  }
}

declare global {
  interface Window { google?: GoogleMapsApi }
  interface ImportMeta {
    readonly env: {
      readonly VITE_GOOGLE_MAPS_API_KEY?: string
      readonly VITE_GOOGLE_MAPS_MAP_ID?: string
    }
  }
}

let googleMapsPromise: Promise<GoogleMapsApi> | undefined

function loadGoogleMaps(apiKey: string): Promise<GoogleMapsApi> {
  if (window.google?.maps) return Promise.resolve(window.google)
  if (googleMapsPromise) return googleMapsPromise

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&v=weekly`
    script.async = true
    script.onload = () => window.google?.maps ? resolve(window.google) : reject(new Error('Google Maps did not initialize.'))
    script.onerror = () => reject(new Error('Google Maps could not load. Check the API key, billing, and Maps JavaScript API settings.'))
    document.head.appendChild(script)
  })

  return googleMapsPromise
}

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
    time: '25 min',
    fare: '₱15–₱25',
    walk: '5 min walk',
    tags: ['JEEP', 'JEEP'],
    note: 'A short local trip through General Trias',
  },
  {
    id: 2,
    title: 'Fewer transfers',
    time: '35 min',
    fare: '₱20–₱30',
    walk: '8 min walk',
    tags: ['JEEP', 'BUS'],
    note: 'A local option via Manggahan',
  },
  {
    id: 3,
    title: 'Lowest estimated fare',
    time: '40 min',
    fare: '₱15–₱25',
    walk: '10 min walk',
    tags: ['JEEP', 'JEEP'],
    note: 'A lower fare estimate with more walking',
  },
]

const mapPoints: MapPoint[] = [
  { name: 'General Trias City Hall', area: 'Bagumbayan', category: 'City services', address: 'City Government of General Trias', lat: 14.38626, lng: 120.88094 },
  { name: 'Robinsons Place General Trias', area: 'Tejero', category: 'Shopping', address: 'EPZA-Bacao Diversion Road', lat: 14.39616, lng: 120.86447 },
  { name: 'Manggahan', area: 'General Trias', category: 'Barangay', address: 'Barangay Manggahan', lat: 14.2921, lng: 120.9111 },
  { name: 'Tejero', area: 'General Trias', category: 'Barangay', address: 'Barangay Tejero', lat: 14.39862, lng: 120.86168 },
]

const navItems: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'explore', label: 'Map', icon: 'map' },
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
    sliders: <><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="8" cy="18" r="2" fill="currentColor"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <path d="M5 12h14"/>,
    shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6Z"/><path d="m9 12 2 2 4-4"/></>,
    jeepney: <><path d="M4 10V7.5A2.5 2.5 0 0 1 6.5 5h9.8a2.5 2.5 0 0 1 2.1 1.2L21 9v8H3v-4.5A2.5 2.5 0 0 1 4 10Z"/><path d="M4 10h14M7 7.5h3m2 0h3M3 13h18M7 17v2m10-2v2"/><circle cx="7" cy="16" r="1.5"/><circle cx="17" cy="16" r="1.5"/></>,
    bus: <><path d="M5 19V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v13"/><path d="M5 13h14M8 7h8v4H8zM8 19v2m8-2v2"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></>,
    van: <><path d="M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 1.7.9L21 13v5H3V8Z"/><path d="M16 7v6h4M6 9h4m2 0h2M3 14h18"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></>,
    tricycle: <><path d="M5 14h11l2-4h2l1 4v3h-3m-8 0H8m-3 0H3v-3l2-3h5l2 6"/><circle cx="5" cy="18" r="2"/><circle cx="16" cy="18" r="2"/><path d="M8 10V7h5l2 3M10 7V5"/></>,
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
  const [isLoading, setIsLoading] = useState(true)
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('general-trias-onboarded') === 'yes')
  const [screen, setScreen] = useState<Screen>('home')
  const [previous, setPrevious] = useState<Screen>('home')
  const [from, setFrom] = useState('General Trias City Hall')
  const [to, setTo] = useState('Robinsons Place General Trias')
  const [rideType, setRideType] = useState('All rides')
  const [selectedRoute, setSelectedRoute] = useState(routes[0])
  const [saved, setSaved] = useState<number[]>(() => JSON.parse(localStorage.getItem('general-trias-saved') || '[]'))
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('general-trias-saved', JSON.stringify(saved)), [saved])
  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [])
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

  if (isLoading) {
    return (
      <main className="app-shell launch-screen" aria-live="polite" aria-label="Loading Lakbay General Trias">
        <div className="launch-content">
          <div className="launch-mark"><Icon name="map" size={31} /></div>
          <p className="launch-name">Lakbay</p>
          <p className="launch-area">GENERAL TRIAS</p>
          <span className="launch-loader" aria-hidden="true"><i /><i /><i /></span>
          <small>Getting your local guide ready</small>
        </div>
      </main>
    )
  }

  if (!onboarded) {
    return (
      <main className="app-shell onboarding">
        <section className="onboarding-art">
          <div className="sun" />
          <div className="road-line road-one" />
          <div className="road-line road-two" />
          <div className="jeepney">
            <div className="jeep-top">GENERAL TRIAS</div>
            <div className="jeep-window"><span /><span /><span /></div>
            <div className="jeep-body"><i /><b>LAKBAY</b><i /></div>
            <div className="wheels"><span /><span /></div>
          </div>
        </section>
        <section className="onboarding-copy">
          <span className="eyebrow">GENERAL TRIAS COMMUTE GUIDE</span>
          <h1>Get around General Trias<br />with confidence.</h1>
          <p>Explore local jeep, bus and tricycle routes, stops and estimated fares across General Trias.</p>
          <button className="primary-button" onClick={() => {
            localStorage.setItem('general-trias-onboarded', 'yes')
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
      <div className="screen" key={screen}>
        {screen === 'home' && <Home from={from} to={to} hasSavedRoutes={saved.length > 0} onPlan={() => go('planner')} onFindRoutes={() => go('results')} onRideType={type => { setRideType(type); go('planner') }} onAlerts={() => go('alerts')} onMap={() => go('explore')} onSaved={() => go('saved')} />}
        {screen === 'planner' && <Planner from={from} to={to} setFrom={setFrom} setTo={setTo} rideType={rideType} setRideType={setRideType} onBack={() => setScreen(previous)} onSearch={() => go('results')} />}
        {screen === 'results' && <Results from={from} to={to} onBack={() => go('planner')} onSelect={route => { setSelectedRoute(route); go('details') }} />}
        {screen === 'details' && <Details route={selectedRoute} from={from} to={to} saved={saved.includes(selectedRoute.id)} onBack={() => setScreen('results')} onSave={() => {
          setSaved(items => items.includes(selectedRoute.id) ? items.filter(id => id !== selectedRoute.id) : [...items, selectedRoute.id])
          setToast(saved.includes(selectedRoute.id) ? 'Removed from saved journeys' : 'Journey saved on this phone')
        }} />}
        {screen === 'explore' && <Explore onTerminal={() => go('terminal')} onPlan={(place) => { setTo(place); go('planner') }} />}
        {screen === 'terminal' && <Terminal onBack={() => setScreen('explore')} onPlan={() => { setFrom('General Trias City Hall'); go('planner') }} />}
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

function Home({ from, to, hasSavedRoutes, onPlan, onFindRoutes, onRideType, onAlerts, onMap, onSaved }: { from: string; to: string; hasSavedRoutes: boolean; onPlan: () => void; onFindRoutes: () => void; onRideType: (type: string) => void; onAlerts: () => void; onMap: () => void; onSaved: () => void }) {
  return (
    <div className="home-screen">
      <section className="home-hero">
        <div className="home-greeting-row">
          <div><p>Magandang hapon</p><h1>Saan ka pupunta?</h1></div>
          <button className="home-alert-button" onClick={onAlerts} aria-label="Open alerts"><Icon name="bell" size={20} /></button>
        </div>
        <section className="home-trip-card" aria-label="Plan a trip">
          <button className="home-trip-place" onClick={onPlan}><span className="start-dot" /><span>{from || 'Set starting point'}</span></button>
          <span className="home-trip-connector" />
          <button className="home-trip-place" onClick={onPlan}><Icon name="pin" size={18} /><span>{to || 'Where to?'}</span></button>
          <div className="home-trip-actions"><button className="home-find-button" onClick={onFindRoutes}><Icon name="search" size={18} />Find routes</button><button className="home-filter-button" onClick={onPlan} aria-label="Trip options"><Icon name="sliders" size={19} /></button></div>
        </section>
      </section>
      <section className="home-content home-dashboard">
        <section className="home-section ride-section">
          <h2>Ride type</h2>
          <div className="ride-type-grid">{[
            { name: 'Jeepney', icon: 'jeepney', color: 'gold' },
            { name: 'Bus', icon: 'bus', color: 'blue' },
            { name: 'UV Express', icon: 'van', color: 'green' },
            { name: 'Tricycle', icon: 'tricycle', color: 'red' },
          ].map(ride => <button key={ride.name} className="ride-type-card" onClick={() => onRideType(ride.name)}><span className={`ride-type-icon ${ride.color}`}><Icon name={ride.icon} size={21} /></span><b>{ride.name}</b></button>)}</div>
        </section>
        <section className="home-section">
          <h2>Nearby terminals</h2>
          <div className="home-empty-prompt"><span className="prompt-icon"><Icon name="locate" size={19} /></span><p>See nearby stops and places in General Trias.</p><button onClick={onMap}>Open map</button></div>
        </section>
        <section className="home-section">
          <h2>Saved routes</h2>
          <button className="home-empty-prompt saved-prompt" onClick={onSaved}><span className="prompt-icon"><Icon name="bookmark" size={19} /></span><p>{hasSavedRoutes ? 'Open your saved routes and travel plans.' : 'Save a route to reach it in one tap.'}</p><Icon name="arrow" size={18} /></button>
        </section>
        <p className="home-disclaimer">Routes, fares and times are sample data. <button onClick={onAlerts}>About our data</button></p>
      </section>
    </div>
  )
}

function Planner({ from, to, setFrom, setTo, rideType, setRideType, onBack, onSearch }: { from: string; to: string; setFrom: (s: string) => void; setTo: (s: string) => void; rideType: string; setRideType: (type: string) => void; onBack: () => void; onSearch: () => void }) {
  const [walk, setWalk] = useState(10)
  const places = ['General Trias City Hall', 'Robinsons Place General Trias', 'Manggahan', 'Tejero', 'Governor’s Drive', 'General Trias Public Market']
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
          <div className="chips">{['All rides', 'Jeepney', 'Bus', 'UV Express', 'Tricycle'].map(type => <button key={type} className={rideType === type ? 'selected' : ''} onClick={() => setRideType(type)}>{type}</button>)}</div>
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
        <p className="results-count"><b>3 local route options</b><span>Sample estimates within General Trias</span></p>
        {routes.map((route, index) => (
          <button className="route-card" key={route.id} onClick={() => onSelect(route)}>
            <div className="route-card-top"><div><small>{index === 0 ? 'RECOMMENDED' : route.title.toUpperCase()}</small><h2>{route.time}</h2></div><span className="fare">{route.fare}</span></div>
            <div className="tag-line">{route.tags.map((tag, i) => <span key={i}><RideTag>{tag}</RideTag>{i < route.tags.length - 1 && <i />}</span>)}</div>
            <p>{route.note}</p>
            <div className="route-meta"><span><Icon name="walk" size={16} />{route.walk}</span><span>{route.tags.length - 1} transfer{route.tags.length > 2 ? 's' : ''}</span><Icon name="arrow" size={18} /></div>
          </button>
        ))}
        <p className="disclaimer">Sample planning estimates for General Trias. Confirm route and fare locally before boarding.</p>
      </div>
    </div>
  )
}

function Details({ route, from, to, saved, onBack, onSave }: { route: Route; from: string; to: string; saved: boolean; onBack: () => void; onSave: () => void }) {
  const steps = [
    { time: '8 min', title: `Walk to ${from} loading area`, detail: 'About 550 m', type: 'WALK' },
    { time: '12 min', title: 'Ride toward Manggahan', detail: 'Confirm the destination with the driver', type: route.tags[0] },
    { time: '5 min', title: 'Transfer at Manggahan', detail: 'Check the local loading point', type: 'TRANSFER' },
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
  const mapElement = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<GoogleMapInstance | null>(null)
  const markerInstances = useRef<{ marker: GoogleMarkerInstance; point: MapPoint }[]>([])
  const [selected, setSelected] = useState<MapPoint | null>(null)
  const [filter, setFilter] = useState('All places')
  const [query, setQuery] = useState('')
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'missing-key' | 'error'>(apiKey ? 'loading' : 'missing-key')
  const [mapError, setMapError] = useState('')
  const visiblePoints = useMemo(() => mapPoints.filter(point => {
    const matchesFilter = filter === 'All places' || point.category === filter
    const matchesQuery = `${point.name} ${point.area} ${point.address}`.toLowerCase().includes(query.trim().toLowerCase())
    return matchesFilter && matchesQuery
  }), [filter, query])

  useEffect(() => {
    if (!apiKey) return

    let cancelled = false
    const initializeMap = async () => {
      try {
        const google = await loadGoogleMaps(apiKey)
        const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
          google.maps.importLibrary('maps') as Promise<{ Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMapInstance }>,
          google.maps.importLibrary('marker') as Promise<{ AdvancedMarkerElement: new (options: { map: GoogleMapInstance; position: { lat: number; lng: number }; title: string; content: HTMLElement }) => GoogleMarkerInstance }>,
        ])
        if (cancelled || !mapElement.current) return

        const map = new Map(mapElement.current, {
          center: { lat: 14.365, lng: 120.887 },
          zoom: 12,
          mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
          clickableIcons: false,
        })
        mapInstance.current = map
        markerInstances.current = mapPoints.map(point => {
          const pin = document.createElement('span')
          pin.className = 'google-map-pin'
          pin.textContent = point.category === 'Shopping' ? 'S' : point.category === 'City services' ? 'C' : '•'
          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: point.lat, lng: point.lng },
            title: point.name,
            content: pin,
          })
          marker.addListener('click', () => setSelected(point))
          return { marker, point }
        })
        setMapStatus('ready')
      } catch (error) {
        if (cancelled) return
        setMapError(error instanceof Error ? error.message : 'Google Maps could not load.')
        setMapStatus('error')
      }
    }

    void initializeMap()
    return () => {
      cancelled = true
      markerInstances.current.forEach(({ marker }) => { marker.map = null })
      markerInstances.current = []
      mapInstance.current = null
    }
  }, [apiKey])

  useEffect(() => {
    const shown = new Set(visiblePoints.map(point => point.name))
    markerInstances.current.forEach(({ marker, point }) => {
      marker.map = shown.has(point.name) ? mapInstance.current : null
    })
  }, [visiblePoints])

  const focusPoint = (point: MapPoint) => {
    setSelected(point)
    mapInstance.current?.panTo({ lat: point.lat, lng: point.lng })
    mapInstance.current?.setZoom(15)
  }

  return (
    <div className="map-screen">
      <div className="google-map-canvas" ref={mapElement} aria-label="Google map of General Trias" />
      {mapStatus !== 'ready' && <div className={`map-status ${mapStatus}`}>
        <span className="map-status-icon"><Icon name={mapStatus === 'error' ? 'close' : 'map'} size={20} /></span>
        <div>
          <b>{mapStatus === 'missing-key' ? 'Connect Google Maps' : mapStatus === 'loading' ? 'Loading General Trias map' : 'Google Maps unavailable'}</b>
          <p>{mapStatus === 'missing-key' ? 'Add a restricted Maps JavaScript API key as VITE_GOOGLE_MAPS_API_KEY to load the interactive map.' : mapStatus === 'loading' ? 'Getting local places ready…' : mapError}</p>
          {mapStatus === 'missing-key' && <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noreferrer">Set up a Maps key <Icon name="arrow" size={15} /></a>}
        </div>
      </div>}
      <div className="map-heading"><span>EXPLORE</span><h1>General Trias</h1><p>Places and local areas</p></div>
      <div className="map-controls">
        <label className="map-search"><Icon name="search" size={19} /><input value={query} onChange={event => { setQuery(event.target.value); setSelected(null) }} placeholder="Search places in General Trias" /></label>
        <div className="map-chips">{['All places', 'City services', 'Shopping', 'Barangay'].map(option => <button key={option} className={filter === option ? 'active' : ''} onClick={() => { setFilter(option); setSelected(null) }}>{option}</button>)}</div>
      </div>
      <div className="zoom-controls"><button aria-label="Zoom in" onClick={() => mapInstance.current?.setZoom((mapInstance.current.getZoom() || 12) + 1)}><Icon name="plus" /></button><button aria-label="Zoom out" onClick={() => mapInstance.current?.setZoom((mapInstance.current.getZoom() || 12) - 1)}><Icon name="minus" /></button><button aria-label="Center General Trias" onClick={() => { mapInstance.current?.panTo({ lat: 14.365, lng: 120.887 }); mapInstance.current?.setZoom(12) }}><Icon name="locate" /></button></div>
      <section className="explore-sheet">
        {selected ? <>
          <div className="explore-sheet-heading"><span className="sheet-label">{selected.category.toUpperCase()}</span><button className="sheet-close" onClick={() => setSelected(null)} aria-label="Close place details"><Icon name="close" size={18} /></button></div>
          <h2>{selected.name}</h2><p>{selected.address} · {selected.area}, General Trias</p>
          <div className="explore-sheet-actions"><button onClick={onTerminal}>Place details</button><button onClick={() => onPlan(selected.name)}>Plan a trip here</button></div>
        </> : <>
          <div className="explore-sheet-heading"><div><span className="sheet-label">GENERAL TRIAS, CAVITE</span><h2>{visiblePoints.length} places on the map</h2></div><small>Place locations only · transit details unverified</small></div>
          <div className="explore-place-list">{visiblePoints.map(point => <button key={point.name} className="explore-place" onClick={() => focusPoint(point)}>
            <span className={`place-marker ${point.category === 'Shopping' ? 'shopping' : point.category === 'City services' ? 'civic' : ''}`}><Icon name="pin" size={18} /></span>
            <span className="place-copy"><b>{point.name}</b><small>{point.category} · {point.area}</small></span><Icon name="arrow" size={18} />
          </button>)}</div>
        </>}
      </section>
    </div>
  )
}

function Terminal({ onBack, onPlan }: { onBack: () => void; onPlan: () => void }) {
  return (
    <div className="light-screen">
      <Header title="Terminal details" onBack={onBack} />
      <div className="terminal-hero"><div className="terminal-sign">GENERAL TRIAS<br /><small>LOCAL TRANSIT GUIDE</small></div></div>
      <div className="content terminal-content">
        <span className="block-label">GENERAL TRIAS</span><h1>Local transit stops</h1><p className="muted">Explore commonly used pickup areas around General Trias City Hall, Manggahan and Tejero.</p>
        <button className="primary-button" onClick={onPlan}>Plan from here <Icon name="arrow" /></button>
        <h2>Routes from this terminal</h2>
        {['General Trias City Hall to Manggahan', 'Tejero to Robinsons Place General Trias', 'Manggahan to General Trias Public Market'].map((x, i) => <div className="terminal-route" key={x}><RideTag>{i === 1 ? 'BUS' : 'JEEP'}</RideTag><div><b>{x}</b><small>Sample local route · confirm service and fare</small></div><Icon name="arrow" /></div>)}
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
          <div className="chips"><button className="selected">All</button><button>Manggahan</button><button>Tejero</button></div>
          <Alert tone="amber" label="SAMPLE AREA NOTE · GENERAL TRIAS" title="Manggahan pickup points" body="Pickup locations can vary by route. Confirm the loading point with your driver." time="Local route guide" />
          <Alert tone="red" label="SAMPLE AREA NOTE · TEJERO" title="Check your destination sign" body="Jeep and bus routes may use different stops. Confirm the signboard before boarding." time="Local route guide" />
          <Alert tone="blue" label="ROUTE GUIDE · GENERAL TRIAS" title="Planning a local trip?" body="Use the planner to compare sample options between stops in General Trias." time="Sample information" />
        </> : <>
          <div className="info-box">Typical frequencies only. Most routes don’t publish fixed timetables.</div>
          {['City Hall to Manggahan', 'Tejero to Robinsons Place General Trias', 'Manggahan to General Trias Public Market'].map((x, i) => <div className="departure" key={x}><RideTag>{i === 1 ? 'BUS' : 'JEEP'}</RideTag><div><b>{x}</b><small>Sample local route</small></div><strong>{['25', '30', '20'][i]} min est.</strong></div>)}
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
        {savedRoutes.length ? savedRoutes.map(route => <button className="saved-card" key={route.id} onClick={() => onOpen(route)}><div><span>SAVED JOURNEY · GENERAL TRIAS</span><h2>City Hall to Manggahan</h2><p>{route.time} · {route.fare}</p><div className="tag-line">{route.tags.map((x, i) => <RideTag key={i}>{x}</RideTag>)}</div></div><Icon name="arrow" /></button>) : <div className="empty-state"><span><Icon name="bookmark" size={34} /></span><h2>No saved journeys yet</h2><p>Save a route to find it here, even when you’re offline.</p><button className="primary-button" onClick={onPlan}>Plan a trip</button></div>}
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
        <section className="profile-card"><div className="avatar large">AM</div><div><h2>Alex Mendoza</h2><p>Usual area: General Trias</p></div><button>Edit</button></section>
        <span className="block-label">COMMUTE PREFERENCES</span>
        <section className="settings-card">
          <div><span><Icon name="map" /></span><div><b>Ride types</b><small>Jeep, Bus and UV</small></div><Icon name="arrow" /></div>
          <div><span><Icon name="walk" /></span><div><b>Maximum walking</b><small>10 minutes per leg</small></div><Icon name="arrow" /></div>
        </section>
        <span className="block-label">SETTINGS</span>
        <section className="settings-card">
          <div><span><Icon name="bell" /></span><div><b>Local route notes</b><small>Updates for General Trias</small></div><button className="switch on"><i /></button></div>
          <div><span><Icon name="menu" /></span><div><b>Larger text</b><small>Bigger text across the app</small></div><button aria-label="Toggle larger text" className={`switch ${large ? 'on' : ''}`} onClick={() => setLarge(x => !x)}><i /></button></div>
          <div><span><Icon name="locate" /></span><div><b>Location</b><small>General Trias, Cavite</small></div><button className="text-button">Check</button></div>
        </section>
        <span className="block-label">HELP</span>
        <section className="settings-card"><div><span><Icon name="shield" /></span><div><b>How to read a route</b></div><Icon name="arrow" /></div><div><span><Icon name="menu" /></span><div><b>About our data</b><small>What’s sample vs. verified</small></div><Icon name="arrow" /></div></section>
        <button className="reset-button" onClick={onReset}>Reset app and onboarding</button>
        <small className="local-note">Lakbay General Trias · sample data build</small>
      </div>
    </div>
  )
}

export default App
