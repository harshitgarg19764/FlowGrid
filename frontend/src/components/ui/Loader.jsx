import './Loader.css';

/**
 * Loader component — displays a spinning indicator.
 * @param {boolean} fullPage - If true, centers the loader in the full viewport.
 */
export default function Loader({ fullPage = false }) {
  return (
    <div className={`loader-container${fullPage ? ' loader-full-page' : ''}`}>
      <div className="loader-spinner" />
    </div>
  );
}
