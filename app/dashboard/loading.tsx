import { Loader } from '../components/loader';

// Next.js's automatic Suspense boundary for this segment -- every
// dashboard page (overview, users, generations, user detail) is a server
// component that fetches fresh on each navigation, so without this the
// content area just goes blank between pages.
export default function DashboardLoading() {
  return <Loader label="Loading..." />;
}
