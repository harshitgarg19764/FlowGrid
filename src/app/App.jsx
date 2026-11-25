import AppProviders from './AppProviders';
import AppRoutes from '../routes/AppRoutes';

/**
 * Main Application Component
 * Sets up providers and routing
 */
function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
