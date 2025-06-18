/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { CheckCircle2, MailCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token'), [searchParams]);

  const [status, setStatus] = useState('idle'); // idle | pending | success | error | no-token
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      setErrorMsg('No invitation token found in the link.');
    } else {
      setStatus('idle');
    }
  }, [token]);

  const handleAccept = async () => {
    setStatus('pending');
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post(
        `/invite/accept-invitation?token=${token}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token') || ''}`,
          },
          validateStatus: () => true, // Accept all status codes
        }
      );

      if (response.status === 200) {
        setStatus('success');
        localStorage.setItem(`invitation-accepted-${token}`, 'true');
      } else if (response.status === 409) {
        setStatus('success');
        setErrorMsg(response.data.message || 'You already accepted this invitation.');
        localStorage.setItem(`invitation-accepted-${token}`, 'true');
      } else {
        setStatus('error');
        setErrorMsg(response.data.message || 'Failed to accept invitation.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMsg(error?.response?.data?.message || 'Failed to accept invitation.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusDetails = {
    idle: {
      title: 'Accept Invitation',
      description: 'Click the button below to accept your invitation.',
      icon: <MailCheck className="h-12 w-12 text-blue-500" aria-hidden="true" />,
      button: (
        <Button onClick={handleAccept} disabled={isLoading || !token}>
          Accept Invitation
        </Button>
      ),
      color: 'text-blue-600',
    },
    pending: {
      title: 'Validating your invitation…',
      description: 'Please wait while we confirm your invitation token.',
      icon: <MailCheck className="h-12 w-12 text-blue-500 animate-pulse" aria-hidden="true" />,
      button: null,
      color: 'text-blue-600',
    },
    success: {
      title: 'Invitation Accepted!',
      description: 'Your token is valid. Welcome aboard!',
      icon: <CheckCircle2 className="h-12 w-12 text-green-600" aria-hidden="true" />,
      button: (
        <Button
          onClick={() => navigate('/manager/dashboard')}
          variant="outline"
          disabled={isLoading}
        >
          Go to Dashboard
        </Button>
      ),
      color: 'text-green-600',
    },
    error: {
      title: 'Invitation Invalid',
      description: errorMsg || 'This token is expired, invalid, or already used.',
      icon: <AlertTriangle className="h-12 w-12 text-red-600" aria-hidden="true" />,
      button: (
        <Button variant="outline" onClick={() => navigate('/')} disabled={isLoading}>
          Return Home
        </Button>
      ),
      color: 'text-red-600',
    },
    'no-token': {
      title: 'No Invitation Token',
      description: errorMsg || 'Please use a valid invitation link to proceed.',
      icon: <AlertTriangle className="h-12 w-12 text-yellow-600" aria-hidden="true" />,
      button: (
        <Button variant="ghost" onClick={() => navigate('/')} disabled={isLoading}>
          Back to Home
        </Button>
      ),
      color: 'text-yellow-600',
    },
  };

  const { title, description, icon, button, color } = statusDetails[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm border border-border rounded-xl shadow-md">
        <CardHeader className="flex flex-col items-center space-y-4 py-8 px-6 text-center">
          <div className={color}>{icon}</div>
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground max-w-xs">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center py-4">
          {isLoading && (
            <div className="flex items-center justify-center h-10">
              <Spinner size="sm" className="bg-foreground" />
            </div>
          )}
          {!isLoading && button}
          {status === 'error' && errorMsg && (
            <div className="mt-2 text-sm text-red-600 text-center">{errorMsg}</div>
          )}
          {status === 'success' && errorMsg && (
            <div className="mt-2 text-sm text-yellow-600 text-center">{errorMsg}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}