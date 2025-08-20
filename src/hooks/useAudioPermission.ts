import { useState, useEffect } from 'react';

type PermissionState = 'prompt' | 'granted' | 'denied' | 'checking';

export function useAudioPermission() {
  const [permissionState, setPermissionState] = useState<PermissionState>('checking');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      // Check if the browser supports permissions API
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionState(permission.state as PermissionState);
        
        // Listen for permission changes
        permission.addEventListener('change', () => {
          setPermissionState(permission.state as PermissionState);
        });
      } else {
        // Fallback: try to access the microphone to check permission
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setPermissionState('granted');
        } catch {
          setPermissionState('denied');
        }
      }
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      setPermissionState('prompt');
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');
      return true;
    } catch (error) {
      setPermissionState('denied');
      return false;
    }
  };

  return {
    permissionState,
    requestPermission,
    isGranted: permissionState === 'granted',
    isDenied: permissionState === 'denied',
    isPrompt: permissionState === 'prompt',
    isChecking: permissionState === 'checking',
  };
}