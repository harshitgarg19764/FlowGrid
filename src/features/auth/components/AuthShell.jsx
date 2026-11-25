import { Link } from 'react-router-dom';
import Brand from '../../../components/ui/Brand';
import Icon from '../../../components/ui/Icon';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import { ROUTES } from '../../../constants/routes';

const railCopy = {
  signin: {
    kicker: 'Access / 01',
    title: 'The grid keeps the record.',
    lede: 'Sign back in to see live holds, approval decisions and the slots waiting on you.',
    points: [
      { icon: 'calendar', label: 'Live holds', note: 'Slots stay reserved while reviewed' },
      { icon: 'list', label: 'Decision trail', note: 'Every approval has a reason' },
      { icon: 'shield', label: 'Role-aware', note: 'Customers and operators, separated' },
    ],
  },
  register: {
    kicker: 'Access / 02',
    title: 'One account. Every workspace.',
    lede: 'Create an account to book across affiliated organisations — or open your own workspace later.',
    points: [
      { icon: 'search', label: 'Find capacity', note: 'Rooms, labs, kit and bays' },
      { icon: 'clock', label: 'Request a slot', note: 'Temporary hold on submit' },
      { icon: 'circleCheck', label: 'Track the decision', note: 'Know where every request stands' },
    ],
  },
};

const boardStates = [
  ['open', 'booked', 'open', 'held'],
  ['booked', 'open', 'held', 'open'],
  ['open', 'held', 'open', 'booked'],
];

const AuthShell = ({ mode = 'signin', children }) => {
  const rail = railCopy[mode];

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-rail">
          <div className="auth-rail-grid" aria-hidden="true" />

          <div className="auth-rail-top">
            <Brand light />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <ThemeToggle />
              <span className="auth-rail-tag mono">secure access</span>
            </div>
          </div>

          <div className="auth-rail-body">
            <span className="auth-rail-kicker mono">{rail.kicker}</span>
            <h1 className="auth-rail-title">{rail.title}</h1>
            <p className="auth-rail-lede">{rail.lede}</p>

            <div className="auth-board" aria-hidden="true">
              <div className="auth-board-head">
                <span className="mono">today / live</span>
                <span className="auth-board-open">
                  <span className="status-dot" />
                  open
                </span>
              </div>
              {boardStates.map((row, rowIndex) => (
                <div className="auth-board-row" key={rowIndex}>
                  <span className="auth-board-label mono">
                    {['studio', 'wet lab', 'bay'][rowIndex]}
                  </span>
                  {row.map((state, index) => (
                    <span
                      key={`${rowIndex}-${index}`}
                      className={`auth-board-cell auth-board-cell--${state}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            <ul className="auth-rail-points">
              {rail.points.map((point) => (
                <li key={point.label}>
                  <Icon name={point.icon} size={16} />
                  <span>
                    <strong>{point.label}</strong>
                    {point.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="auth-rail-foot">
            <Link to={ROUTES.HOME} className="auth-rail-link">
              <Icon name="arrowLeft" size={15} />
              Back to overview
            </Link>
            <span className="mono">flowgrid / v1.0</span>
          </div>
        </aside>

        <main className="auth-panel">
          <div className="auth-panel-inner">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AuthShell;
