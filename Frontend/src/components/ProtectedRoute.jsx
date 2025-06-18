import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from './ui/spinner';
import axios from 'axios';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

export function ProtectedRoute({ allowedRole, children }) {
  const [status, setStatus] = useState('loading');
  // eslint-disable-next-line no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await axios.post(
          '/auth/verify',
          { allowedRole },
          {
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            },
          }
        );

        const { user } = res.data;

        if (isMounted && res.status === 200 && user?.verified && user?.role === allowedRole) {
          toast.success(`Welcome to ${user.role} Dashboard. You are authorized.`, {
            id: 'auth-success',
          });
          setStatus('authorized');
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          toast.error('You are not authorized to access this page.', {
            id: 'auth-error',
          });
          setStatus('unauthorized');
          localStorage.setItem(
            'redirectAfterLogin',
            window.location.pathname + window.location.search
          );
          navigate('/login');
        }
      } catch (err) {
        if (isMounted) {
          toast.error(
            `Session expired or unauthorized. ${err?.response?.data?.message || err.message}`,
            { id: 'auth-fail' }
          );
          setStatus('unauthorized');
          localStorage.setItem(
            'redirectAfterLogin',
            window.location.pathname + window.location.search
          );
          navigate('/login');
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [allowedRole]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="text-center mb-4">
          <p className="text-muted-foreground mb-4">Checking your authorization...</p>
          <p className="text-muted-foreground mb-4">Please wait...</p>
          <p className="text-muted-foreground mb-4">This may take a few seconds.</p>
          <p className="text-muted-foreground mb-4">
            If you are not redirected, please try logging in again.
          </p>
        </div>

        <Spinner size="sm" className="bg-foreground" />
      </div>
    );
  }

  if (status === 'authorized') {
    return children;
  }

  return <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
  allowedRole: PropTypes.oneOf(['creator', 'manager']).isRequired,
  children: PropTypes.node.isRequired,
};
