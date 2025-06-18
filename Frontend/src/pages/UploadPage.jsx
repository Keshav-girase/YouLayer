import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { UploadVideo } from '@/components/UploadVideo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const UploadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = location.state?.isAuthenticated;

  const goToDashboard = () => {
    navigate('/manager/dashboard');
  };

  if (!isAuthenticated) {
    return <Navigate to="/manager/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background">
      <Helmet>
        <title>Upload Video – YouLayer</title>
      </Helmet>
      {/* Back Button */}
      <div className="w-full max-w-3xl mb-6">
        <Button
          variant="ghost"
          onClick={goToDashboard}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      {/* Upload Form Container */}
      <div className="w-full max-w-3xl border border-muted rounded-2xl bg-card shadow-sm p-8 space-y-6">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Upload New Video</h2>
          <p className="text-sm text-muted-foreground">
            Choose a file and fill in required metadata to publish your video.
          </p>
        </div>

        {/* Upload Form */}
        <UploadVideo />
      </div>
    </div>
  );
};
