import './Loader.css';

/**
 * Loading indicator
 * A four-cell grid that pulses in sequence, matching the FlowGrid mark.
 *
 * @param {string} size - Size variant: small, medium, large
 * @param {string} text - Optional loading text
 */
const Loader = ({ size = 'medium', text = 'Loading' }) => {
  return (
    <div className={`loader-container loader-${size}`} role="status" aria-live="polite">
      <div className="loader-grid" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <span className="loader-text">{text}</span>
      <span className="sr-only">{text}</span>
    </div>
  );
};

export default Loader;
