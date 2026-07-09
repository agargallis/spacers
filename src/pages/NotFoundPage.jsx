import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <PageShell>
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="font-[var(--font-display)] text-8xl font-black accent-gradient-text">404</div>
        <p className="mt-4 text-lg text-[color:var(--text-dim)]">
          Η σελίδα που ζητήσατε δεν βρέθηκε.
        </p>
        <Button to="/" className="mt-8">
          Επιστροφή στην αρχική
        </Button>
      </div>
    </PageShell>
  );
}
