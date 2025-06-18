import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background">
      <div className="w-full max-w-3xl border border-muted rounded-2xl bg-card shadow-sm p-8 space-y-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-destructive mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground text-center mb-6">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Button
          variant="link"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
