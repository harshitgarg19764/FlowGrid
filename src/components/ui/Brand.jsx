import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

/**
 * FlowGrid wordmark.
 * The mark is a four-cell grid with one live cobalt cell.
 */
const Brand = ({ to = ROUTES.HOME, light = false, onClick }) => (
  <Link
    to={to}
    className={`brand ${light ? 'brand--light' : ''}`}
    onClick={onClick}
    aria-label="FlowGrid home"
  >
    <span className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
    <span className="brand-name">flowgrid</span>
  </Link>
);

export default Brand;
