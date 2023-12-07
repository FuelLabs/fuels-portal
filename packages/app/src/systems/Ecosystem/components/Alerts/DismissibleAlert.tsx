import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  AlertActions,
  AlertButton,
  AlertDescription,
  AlertTitle,
} from '@fuel-ui/react';
import React, { useEffect, useState } from 'react';

const slideInAnimation = cssObj({
  animation: 'slideIn 0.5s ease-out forwards',
  '@keyframes slideIn': {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0%)' },
  },
});

const slideOutAnimation = cssObj({
  animation: 'slideOut 0.5s ease-in forwards',
  '@keyframes slideOut': {
    from: { transform: 'translateX(0%)' },
    to: { transform: 'translateX(110%)' },
  },
});

const DismissibleAlert = ({ description }: { description: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsMounted(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsMounted(false);
    }, 500);
  };

  if (!isMounted) {
    return null;
  }

  const styles = {
    alert: cssObj({
      zIndex: 1000,
      ...(isVisible ? slideInAnimation : slideOutAnimation),
      overflow: 'hidden',
      display: 'flex',
    }),
  };

  return (
    <Alert css={styles.alert} status="info" direction="column">
      <AlertTitle>Learn More</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      <AlertActions>
        <AlertButton onClick={handleClose}>Dismiss</AlertButton>
      </AlertActions>
    </Alert>
  );
};

export default DismissibleAlert;
