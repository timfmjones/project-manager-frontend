import { useState, useRef, useEffect } from 'react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onRecordingComplete, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create MediaRecorder with appropriate MIME type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/ogg';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      // Reset chunks
      chunksRef.current = [];

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setPermissionDenied(false);

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    if (audioURL) {
      const response = await fetch(audioURL);
      const blob = await response.blob();
      onRecordingComplete(blob);
      
      // Reset state
      setAudioURL(null);
      setRecordingTime(0);
    }
  };

  const handleDiscard = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {permissionDenied && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">
            Microphone permission denied. Please allow microphone access to record audio.
          </p>
        </div>
      )}

      {!isRecording && !audioURL && (
        <div className="text-center py-8">
          <button
            onClick={startRecording}
            disabled={disabled}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            Start Recording
          </button>
          <p className="text-sm text-gray-500 mt-2">Click to start recording your voice</p>
        </div>
      )}

      {isRecording && (
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-pulse">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-lg font-medium text-gray-700">
                Recording: {formatTime(recordingTime)}
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            {!isPaused ? (
              <button
                onClick={pauseRecording}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Resume
              </button>
            )}
            
            <button
              onClick={stopRecording}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop
            </button>
          </div>

          {/* Visual audio indicator */}
          <div className="mt-6 flex justify-center space-x-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-blue-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 30 + 10}px`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {audioURL && !isRecording && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Recording Complete ({formatTime(recordingTime)})
              </p>
              <audio controls className="w-full">
                <source src={audioURL} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDiscard}
                className="btn-secondary"
              >
                Discard
              </button>
              <button
                onClick={startRecording}
                className="btn-secondary"
              >
                Re-record
              </button>
              <button
                onClick={handleSubmit}
                disabled={disabled}
                className="btn-primary"
              >
                {disabled ? 'Processing...' : 'Submit Recording'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}