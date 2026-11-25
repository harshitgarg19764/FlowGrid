import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import Icon from '../../../components/ui/Icon';
import IMAGES from '../../../utils/imageAssets';
import './HomePage.css';

const initialBoardRows = [
  {
    name: 'Studio 02',
    meta: 'Meeting room · 8 people',
    tag: 'STUDIO // 02',
    image: IMAGES.roomFuturistic,
    slots: ['booked', 'open', 'open', 'held', 'open'],
  },
  {
    name: 'Wet Lab B',
    meta: 'Laboratory · 4 benches',
    tag: 'LAB // 08',
    image: IMAGES.labFuturistic,
    slots: ['open', 'held', 'booked', 'open', 'open'],
  },
  {
    name: 'Cargo Bike 07',
    meta: 'Equipment · 2h max',
    tag: 'KIT // 07',
    image: IMAGES.equipmentBay,
    slots: ['booked', 'open', 'booked', 'open', 'held'],
  },
  {
    name: 'Bay 04',
    meta: 'Parking · EV charger',
    tag: 'BAY // 04',
    image: IMAGES.evHangar,
    slots: ['open', 'open', 'open', 'booked', 'open'],
  },
  {
    name: 'Desk 12',
    meta: 'Workspace · 1 person',
    tag: 'FLEX // 12',
    image: IMAGES.roomFuturistic,
    slots: ['held', 'booked', 'open', 'open', 'open'],
  },
];

const boardTimes = ['09:00', '10:00', '11:00', '12:00', '13:00'];

const facilityShowcases = [
  {
    title: 'Holographic Boardrooms & Studios',
    type: 'MEETING_ROOM',
    tag: 'STUDIO // 02',
    capacity: '12-24 Persons',
    status: 'ACTIVE SYNC',
    image: IMAGES.roomFuturistic,
    description: 'Immersive smart conference spaces with glass acoustic isolation and instant reservation controls.',
    features: ['Instant QR access', 'Holographic display', 'Climate sync'],
  },
  {
    title: 'Quantum & Bio-Tech Cleanrooms',
    type: 'LABORATORY',
    tag: 'LAB // 08',
    capacity: '4-8 Benches',
    status: 'CLEARED SPEC',
    image: IMAGES.labFuturistic,
    description: 'Precision research environments with verified protocol clearance and strict handover logs.',
    features: ['Bio-safety Level 2', 'Laser optics bench', 'Airflow telemetry'],
  },
  {
    title: 'Autonomous EV & Mobility Hangars',
    type: 'PARKING',
    tag: 'HUB // 04',
    capacity: '350kW Supercharge',
    status: 'OPEN BAY',
    image: IMAGES.evHangar,
    description: 'Autonomous vehicle docking and high-velocity electric fleet chargers with precise arrival windows.',
    features: ['CCS / NACS ultra-speed', 'Telemetry handshake', 'License plate unlock'],
  },
  {
    title: 'Modular Prototyping Hardware Bay',
    type: 'EQUIPMENT',
    tag: 'RACK // 19',
    capacity: 'Shared Rack Access',
    status: 'CALIBRATED',
    image: IMAGES.equipmentBay,
    description: 'Diagnostic equipment, quantum compute racks, and shared hardware engineering stations.',
    features: ['ESD-safe workstations', 'Real-time hold queue', 'Digital handover log'],
  },
];

const categories = [
  {
    icon: 'building',
    name: 'Meeting rooms',
    description: 'Boardrooms, pods and interactive focus studios by the hour.',
    count: '124 open',
    next: 'Next 11:30',
    image: IMAGES.roomFuturistic,
  },
  {
    icon: 'flask',
    name: 'Labs & test benches',
    description: 'Specialist facilities with digital access rules attached.',
    count: '37 open',
    next: 'Next 13:00',
    image: IMAGES.labFuturistic,
  },
  {
    icon: 'wrench',
    name: 'Equipment & Racks',
    description: 'Modular hardware, calibration rigs and shared lab kit.',
    count: '86 open',
    next: 'Next 09:45',
    image: IMAGES.equipmentBay,
  },
  {
    icon: 'car',
    name: 'Parking & EV',
    description: 'High-speed chargers and vehicle bays with reserved arrival windows.',
    count: '203 open',
    next: 'Next 10:15',
    image: IMAGES.evHangar,
  },
  {
    icon: 'grid',
    name: 'Desks & studios',
    description: 'Hot desks, cyber production bays and flexible team space.',
    count: '59 open',
    next: 'Next 09:00',
    image: IMAGES.roomFuturistic,
  },
];

const steps = [
  {
    title: 'Scan live capacity matrix',
    description: 'Real-time telemetry across every campus, laboratory, and workspace you have permission to access.',
  },
  {
    title: 'Request with automated hold',
    description: 'Select your time window. FlowGrid locks down the slot instantly while operator review occurs.',
  },
  {
    title: 'Deterministic sign-off queue',
    description: 'Operators clear requests from an audit-ready unified dashboard with verified decision histories.',
  },
  {
    title: 'Contactless arrival & handover',
    description: 'Digital access credentials, telemetry notes, and slot handovers are bound to a single living record.',
  },
];

const capabilities = [
  {
    icon: 'shield',
    title: 'Conflict-aware micro-holds',
    description:
      'A pending request instantly claims the slot on the matrix. Zero silent double-bookings, zero calendar collisions.',
  },
  {
    icon: 'list',
    title: 'Immutable decision trail',
    description:
      'Every approval, hold release, or policy update records identity, timestamp, and context for complete operational clarity.',
  },
  {
    icon: 'bell',
    title: 'Dynamic waitlist automation',
    description:
      'When an active hold is released or expired, the next queued team member is immediately notified and provisioned.',
  },
  {
    icon: 'clock',
    title: 'Unified record at handover',
    description:
      'Time codes, physical coordinates, entry pins, and facility instructions live in one central HUD.',
  },
];

const homeMetrics = [
  { value: '514', label: 'live resources', note: 'Rooms, labs, kit and charging bays' },
  { value: '10.4k', label: 'holds cleared', note: 'With a verified audit trail' },
  { value: '214', label: 'active workspaces', note: 'Running on synchronous grid rules' },
  { value: '99.98%', label: 'grid availability', note: 'Measured across multi-region nodes' },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [boardRows, setBoardRows] = useState(initialBoardRows);
  const [selectedRowName, setSelectedRowName] = useState('Studio 02');
  const [activeSlotMessage, setActiveSlotMessage] = useState(null);

  const selectedRow = boardRows.find((r) => r.name === selectedRowName) || boardRows[0];

  const handleCellClick = (rowName, timeIndex) => {
    setSelectedRowName(rowName);
    setBoardRows((prev) =>
      prev.map((row) => {
        if (row.name !== rowName) return row;
        const currentSlot = row.slots[timeIndex];
        const nextSlot =
          currentSlot === 'open' ? 'held' : currentSlot === 'held' ? 'booked' : 'open';
        const newSlots = [...row.slots];
        newSlots[timeIndex] = nextSlot;
        return { ...row, slots: newSlots };
      })
    );

    setActiveSlotMessage(`Slot ${boardTimes[timeIndex]} for ${rowName} toggled.`);
    setTimeout(() => setActiveSlotMessage(null), 2500);
  };

  return (
    <div className="home">
      {/* ── Hero Section ───────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-bg-glow" aria-hidden="true" />
        <div className="home-hero-grid" aria-hidden="true" />

        <div className="container home-hero-inner">
          <div className="home-hero-copy">
            <div className="hero-meta">
              <span className="hero-meta-live">
                <span className="status-dot" aria-hidden="true" />
                QUANTUM SYNC LIVE
              </span>
              <span className="hero-meta-divider" aria-hidden="true" />
              <span className="mono">214 WORKSPACES ONLINE</span>
            </div>

            <h1 className="hero-title">
              Every room, lab & bay.
              <span className="hero-title-accent">One live grid.</span>
            </h1>

            <p className="hero-lede">
              FlowGrid turns physical spaces and specialist equipment into a real-time,
              conflict-free operating timetable — with instant holds, verified approvals,
              and frictionless handovers.
            </p>

            <div className="hero-actions">
              <Link to={ROUTES.APP_RESOURCES} className="btn btn-primary btn-lg">
                <Icon name="search" size={18} />
                Explore Catalogue
              </Link>
              {!isAuthenticated && (
                <Link to={ROUTES.REGISTER_ORGANISATION} className="btn btn-outline btn-lg">
                  Launch Workspace
                </Link>
              )}
            </div>

            <div className="hero-footnote">
              <Icon name="shield" size={16} />
              <span>Multi-tenant protocol · Instant conflict prevention · Enterprise audit logs</span>
            </div>
          </div>

          <div className="hero-board-wrap">
            <div className="board">
              {/* Futuristic HUD Corners */}
              <div className="hud-corner hud-corner--tl" aria-hidden="true" />
              <div className="hud-corner hud-corner--tr" aria-hidden="true" />
              <div className="hud-corner hud-corner--bl" aria-hidden="true" />
              <div className="hud-corner hud-corner--br" aria-hidden="true" />

              {/* Scanning Radar Line */}
              <div className="board-scanline" aria-hidden="true" />

              {/* Interactive Relevant Facility Visual Preview */}
              <div className="board-preview-card">
                <div className="board-preview-media">
                  <img
                    src={selectedRow.image}
                    alt={selectedRow.name}
                    className="board-preview-img"
                  />
                  <div className="board-preview-overlay" />
                  <div className="board-preview-meta">
                    <div>
                      <span className="board-preview-tag mono">{selectedRow.tag}</span>
                      <h3 className="board-preview-title">{selectedRow.name}</h3>
                      <p className="board-preview-subtitle">{selectedRow.meta}</p>
                    </div>
                    <span className="board-preview-status mono">
                      <span className="status-dot" aria-hidden="true" />
                      LIVE FEED
                    </span>
                  </div>
                </div>
              </div>

              <div className="board-head">
                <div>
                  <span className="board-kicker mono">MATRIX RADAR // MERIDIAN WORKS</span>
                  <h2>Live Timetable Terminal</h2>
                </div>
                <div className="board-head-badges">
                  <span className="board-open">
                    <span className="status-dot" aria-hidden="true" />
                    LIVE TELEMETRY
                  </span>
                </div>
              </div>

              <div
                className="board-table"
                role="group"
                aria-label="Interactive live availability board"
              >
                <div className="board-row board-row--head" aria-hidden="true">
                  <span className="board-resource-head">Resource</span>
                  {boardTimes.map((time) => (
                    <span
                      key={time}
                      className={`board-time ${time === '11:00' ? 'is-current' : ''}`}
                    >
                      {time}
                    </span>
                  ))}
                </div>

                {boardRows.map((row) => (
                  <div
                    key={row.name}
                    className={`board-row ${selectedRowName === row.name ? 'is-selected-row' : ''}`}
                    onMouseEnter={() => setSelectedRowName(row.name)}
                  >
                    <button
                      type="button"
                      className="board-resource board-resource-btn"
                      onClick={() => setSelectedRowName(row.name)}
                      title={`Select ${row.name} to view facility`}
                    >
                      <span className="board-resource-name">{row.name}</span>
                      <span className="board-resource-meta">{row.meta}</span>
                    </button>
                    {row.slots.map((state, index) => (
                      <button
                        type="button"
                        key={`${row.name}-${boardTimes[index]}`}
                        className={`board-cell board-cell--${state} ${
                          boardTimes[index] === '11:00' ? 'is-current' : ''
                        }`}
                        onClick={() => handleCellClick(row.name, index)}
                        title={`Click to simulate hold: ${row.name} at ${boardTimes[index]}`}
                      >
                        <span className="sr-only">
                          {boardTimes[index]}: {state}
                        </span>
                        <span aria-hidden="true" className="board-cell-indicator" />
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <div className="board-foot">
                <div className="board-legend" aria-hidden="true">
                  <span>
                    <i className="legend-key legend-key--open" />
                    Open
                  </span>
                  <span>
                    <i className="legend-key legend-key--held" />
                    Held
                  </span>
                  <span>
                    <i className="legend-key legend-key--booked" />
                    Reserved
                  </span>
                </div>
                <Link to={ROUTES.APP_RESOURCES} className="board-link">
                  <span>Enter Full Grid</span>
                  <Icon name="arrowUpRight" size={15} />
                </Link>
              </div>

              {activeSlotMessage && (
                <div className="board-toast mono" role="status">
                  <Icon name="zap" size={13} />
                  <span>{activeSlotMessage}</span>
                </div>
              )}
            </div>

            <div className="board-caption">
              <span className="mono">INTERACTIVE PREVIEW</span>
              <strong>Click any cell</strong>
              <span>to simulate live hold & release</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics Strip ──────────────────────────── */}
      <section className="home-metrics" aria-label="FlowGrid platform telemetry">
        <div className="container home-metrics-grid">
          {homeMetrics.map((metric) => (
            <div key={metric.label} className="home-metric">
              <span className="home-metric-value">{metric.value}</span>
              <span className="home-metric-label mono">{metric.label}</span>
              <span className="home-metric-note">{metric.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Futuristic Facility Visual Showcase ────── */}
      <section className="home-section home-showcase">
        <div className="container">
          <div className="home-section-head">
            <div>
              <span className="section-index mono">01 / The Physical Grid</span>
              <h2>Engineered for high-velocity teams.</h2>
            </div>
            <div className="home-section-aside">
              <p>
                From cleanroom laboratories and acoustic studios to autonomous vehicle charging bays,
                every asset is synchronized into one unified visual timetable.
              </p>
              <Link to={ROUTES.APP_RESOURCES} className="text-link">
                View all facility types
                <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>

          <div className="showcase-grid">
            {facilityShowcases.map((facility) => (
              <article key={facility.title} className="showcase-card">
                <div className="showcase-media">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="showcase-img"
                    loading="lazy"
                  />
                  <div className="showcase-overlay" />
                  <div className="showcase-badges">
                    <span className="showcase-tag mono">{facility.tag}</span>
                    <span className="showcase-status">
                      <span className="status-dot" aria-hidden="true" />
                      {facility.status}
                    </span>
                  </div>
                </div>

                <div className="showcase-content">
                  <span className="showcase-capacity mono">{facility.capacity}</span>
                  <h3>{facility.title}</h3>
                  <p>{facility.description}</p>

                  <ul className="showcase-features">
                    {facility.features.map((feat) => (
                      <li key={feat}>
                        <Icon name="check" size={13} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={ROUTES.APP_RESOURCES}
                    className="btn btn-outline btn-block showcase-cta"
                  >
                    Check Availability
                    <Icon name="arrowUpRight" size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catalogue Ledger with Media Thumbnails ──── */}
      <section className="home-section home-catalogue">
        <div className="container">
          <div className="home-section-head">
            <div>
              <span className="section-index mono">02 / Catalogue Index</span>
              <h2>One timetable language. Zero friction.</h2>
            </div>
            <div className="home-section-aside">
              <p>
                Whether reserving an 8-bench bio lab or a fast-charge parking stall, users experience
                the same effortless 3-second booking flow.
              </p>
              <Link to={ROUTES.APP_RESOURCES} className="text-link">
                Open Full Index
                <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>

          <div className="catalogue-ledger">
            <div className="catalogue-ledger-head" aria-hidden="true">
              <span>Facility Type</span>
              <span>Live Available</span>
              <span>Next Window</span>
              <span />
            </div>
            {categories.map((category, index) => (
              <Link
                to={ROUTES.APP_RESOURCES}
                className="catalogue-row"
                key={category.name}
              >
                <div className="catalogue-type">
                  <span className="catalogue-index mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="catalogue-thumb-wrap">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="catalogue-thumb"
                      loading="lazy"
                    />
                  </div>
                  <div className="catalogue-copy">
                    <strong>{category.name}</strong>
                    <span>{category.description}</span>
                  </div>
                </div>
                <span className="catalogue-live mono">
                  <span className="status-dot" aria-hidden="true" />
                  {category.count}
                </span>
                <span className="catalogue-next mono">{category.next}</span>
                <span className="catalogue-arrow" aria-hidden="true">
                  <Icon name="arrowUpRight" size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sequence Section ───────────────────────── */}
      <section className="home-flow" id="how-it-works">
        <div className="container">
          <div className="home-flow-head">
            <div>
              <span className="section-index section-index--light mono">03 / The Sequence</span>
              <h2>From request to signed-off, in four moves.</h2>
            </div>
            <p>
              Instant hold mechanisms protect reserved capacity the millisecond you request it.
              Approval managers get high-density triage, customers get transparent telemetry.
            </p>
          </div>

          <ol className="flow-steps">
            {steps.map((step, index) => (
              <li key={step.title} className="flow-step">
                <span className="flow-step-index mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Capabilities Section ───────────────────── */}
      <section className="home-section home-capabilities">
        <div className="container">
          <div className="home-section-head home-section-head--stacked">
            <div>
              <span className="section-index mono">04 / Core Architecture</span>
              <h2>Built for mission-critical operations.</h2>
            </div>
            <p className="home-section-lede">
              Most scheduling tools fail at hold management and role boundaries. FlowGrid is
              purpose-built for shared governance and high-stakes resources.
            </p>
          </div>

          <div className="capability-grid">
            {capabilities.map((capability, index) => (
              <article key={capability.title} className="capability-row">
                <span className="capability-index mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="capability-icon">
                  <Icon name={capability.icon} size={22} />
                </span>
                <div>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────── */}
      <section className="home-cta">
        <div className="home-cta-bg-image" aria-hidden="true">
          <img src={IMAGES.roomFuturistic} alt="Modern Smart Facility" />
        </div>
        <div className="home-cta-grid" aria-hidden="true" />
        <div className="container home-cta-inner">
          <div className="home-cta-content">
            <span className="section-index section-index--light mono">05 / Synchronize Today</span>
            <h2>Put your physical operations on the grid.</h2>
            <p>
              Publish your first bookable resource in minutes. Configure automated approval rules,
              invite your organization, and eliminate double-booking forever.
            </p>
          </div>
          <div className="home-cta-actions">
            {!isAuthenticated ? (
              <>
                <Link to={ROUTES.REGISTER} className="btn btn-primary btn-lg">
                  Create Account
                </Link>
                <Link to={ROUTES.REGISTER_ORGANISATION} className="btn btn-outline btn-lg">
                  Register Organization
                </Link>
              </>
            ) : (
              <Link to={ROUTES.APP_RESOURCES} className="btn btn-primary btn-lg">
                Access Live Grid
              </Link>
            )}
            <span className="home-cta-note mono">Free to set up · Zero hardware installation required</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
