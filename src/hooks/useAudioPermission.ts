import { useState, useEffect, useCallback } from 'react';

interface AudioPermissionState {
  hasPermission: boolean | null;
  isChecking: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
}

export function useAudioPermission(): AudioPermissionState {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPermission = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      // Check if the browser supports the Permissions API
      if ('permissions' in navigator && 'query' in navigator.permissions) {
        const permission = await navigator.permissions.query({ 
          name: 'microphone' as PermissionName 
        });
        setHasPermission(permission.state === 'granted');
        
        // Listen for permission changes
        permission.addEventListener('change', () => {
          setHasPermission(permission.state === 'granted');
        });
      } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Fallback: Check if we can access the microphone
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Clean up the stream immediately
          stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
          setHasPermission(true);
        } catch {
          setHasPermission(false);
        }
      } else {
        setError('Audio recording is not supported in this browser');
        setHasPermission(false);
      }
    } catch (err) {
      console.error('Error checking audio permission:', err);
      setError('Failed to check audio permission');
      setHasPermission(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Audio recording is not supported in this browser');
        setHasPermission(false);
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Clean up the stream immediately after getting permission
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setHasPermission(true);
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Error requesting audio permission:', error);
      
      // Provide user-friendly error messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setError('Microphone access was denied. Please allow microphone access in your browser settings.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setError('Your microphone is already in use by another application.');
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        setError('No microphone found that matches the requirements.');
      } else if (error.name === 'TypeError') {
        setError('Audio recording requires a secure connection (HTTPS).');
      } else {
        setError('Failed to access microphone. Please check your browser settings.');
      }
      
      setHasPermission(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    hasPermission,
    isChecking,
    error,
    requestPermission,
  };
}