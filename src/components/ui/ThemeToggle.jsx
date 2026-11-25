import { useTheme } from '../../context/ThemeContext';
import Icon from './Icon';
import './ThemeToggle.css';

/**
 * ThemeToggle
 * Next-level futuristic theme switcher with cyber glow and animated sun/moon
 */
const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode (Current: ${theme})`}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">
          <Icon name={isDark ? 'moon' : 'sun'} size={14} className="theme-toggle-icon" />
        </span>
      </span>
      {showLabel && (
        <span className="theme-toggle-label mono">
          {isDark ? 'NIGHT' : 'DAY'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
