import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { WaveformEmpty } from '../components/Waveform';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" />
      <WaveformEmpty
        title="404 — Signal Lost"
        description="The page you're looking for doesn't exist or has been moved."
      >
        <Link
          to="/"
          className="inline-block rounded-xl bg-signal px-6 py-3 font-semibold text-cloud hover:bg-signal/90 focus:outline-none focus:ring-2 focus:ring-signal"
        >
          Back to Home
        </Link>
      </WaveformEmpty>
    </>
  );
}
