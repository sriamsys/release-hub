import { AppProviders } from './app/AppProviders';
import { AppRoutes } from './routes';

/**
 * ReleaseHub Root Component
 */
export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
