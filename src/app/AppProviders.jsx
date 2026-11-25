import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

/**
 * Application Providers
 * Wrap the app with all necessary context providers
 */
const AppProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
