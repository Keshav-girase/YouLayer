/* eslint-disable no-unused-vars */
import './App.css';
import './index.css';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/Context/ThemeContext';
import { MailOpen } from 'lucide-react';
import { ThemeToggle } from './components/ui/ThemeToggle';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { UploadVideo } from './components/UploadVideo';
import Footer from './components/Footer';
import { Upload } from './components/Upload';
import DateTimePicker from './components/ui/DateTimePicker';
import React, { useState, useEffect } from 'react';
import CircularProgress from './components/ui/CircularProgress';
import SignupTabs from './pages/SignupTabs';
import LoginTabs from './pages/LoginTabs';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Creator from './pages/Creator';
import Manager from './pages/Manager';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UploadPage } from './pages/UploadPage';
import AcceptInvitation from './pages/AcceptInvitation';
import ReviewVideo from './pages/ReviewVideo';
import NotFound from './pages/NotFound';

function App() {
  const [dateTimeISO, setDateTimeISO] = useState('');

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const interval = setTimeout(() => {
        setProgress(prev => Math.min(prev + 1, 100));
      }, 20); // adjust speed if needed
      return () => clearTimeout(interval);
    }
  }, [progress]);
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          {/* Routes with Navbar + Footer */}
          <Route path="/" element={<Layout />}>
            {/* index element means the default route for this path */}
            <Route index element={<HomePage />} />

            <Route path="signup" element={<SignupTabs />} />
            <Route path="login" element={<LoginTabs />} />

            {/* Protected Routes */}
            <Route
              path="creator/dashboard"
              element={
                <ProtectedRoute allowedRole="creator">
                  <Creator />
                </ProtectedRoute>
              }
            />
            <Route
              path="creator/dashboard"
              element={
                <ProtectedRoute allowedRole="creator">
                  <Creator />
                </ProtectedRoute>
              }
            />
            <Route path="/creator/dashboard/videos/:id/review" element={<ReviewVideo />} />

            {/* Manager Routes */}
            <Route
              path="manager/dashboard"
              element={
                <ProtectedRoute allowedRole="manager">
                  <Manager />
                </ProtectedRoute>
              }
            />

            <Route
              path="manager/dashboard/upload"
              element={
                <ProtectedRoute allowedRole="manager">
                  <UploadPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="manager/dashboard/accept-invitation"
              element={
                <ProtectedRoute allowedRole="manager">
                  <AcceptInvitation />
                </ProtectedRoute>
              }
            />
            <Route path="/manager/dashboard/videos/:id/review" element={<ReviewVideo />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
