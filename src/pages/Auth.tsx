
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import FeaturesIntro from '@/components/auth/FeaturesIntro';
import UniversityForm from '@/components/auth/UniversityForm';
import AuthForm from '@/components/auth/AuthForm';

enum OnboardingStep {
  FEATURES_INTRO,
  UNIVERSITY_FORM,
  AUTH_FORM
}

const Auth = () => {
  const navigate = useNavigate();
  const { session, isLoading, checkAuth } = useAuthStore();
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.FEATURES_INTRO);
  const [universityData, setUniversityData] = useState({ university: '', college: '' });

  // Check auth status when component mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && session) {
      console.log("User is already logged in, redirecting to home page");
      navigate('/');
    }
  }, [session, isLoading, navigate]);

  const handleAuthSuccess = async () => {
    // Refresh auth state
    await checkAuth();
    // Navigate to home page
    navigate('/');
  };

  const handleUniversityFormComplete = (data: { university: string; college: string }) => {
    setUniversityData(data);
    setStep(OnboardingStep.AUTH_FORM);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Don't render the auth form if already authenticated
  if (session) {
    return null;
  }

  // Render different steps based on current step
  const renderStep = () => {
    switch (step) {
      case OnboardingStep.FEATURES_INTRO:
        return <FeaturesIntro onContinue={() => setStep(OnboardingStep.UNIVERSITY_FORM)} />;
      case OnboardingStep.UNIVERSITY_FORM:
        return <UniversityForm onComplete={handleUniversityFormComplete} />;
      case OnboardingStep.AUTH_FORM:
        return <AuthForm universityData={universityData} onSuccess={handleAuthSuccess} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
