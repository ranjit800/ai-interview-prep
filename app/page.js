// /app/page.js
import { LoaderCircle } from 'lucide-react';

export default function HomePage() {
  // This page just shows a loading spinner.
  // The middleware will handle redirecting the user to either the
  // login page or the dashboard based on their authentication status.
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <LoaderCircle size={48} className="animate-spin" />
    </div>
  );
}