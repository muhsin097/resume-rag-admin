import { Loader } from './components/loader';

// Root-level fallback for anything outside /dashboard (just /login today).
export default function RootLoading() {
  return <Loader label="Loading..." />;
}
