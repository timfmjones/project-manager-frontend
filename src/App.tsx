import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppRoutes } from './routes';
import { Navbar } from './components/layout/Navbar';
import { handleGoogleRedirectResult } from './lib/auth';

function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for Google redirect result on app load
    const checkRedirect = async () => {
      try {
        await handleGoogleRedirectResult();
      } catch (error) {
        console.error('Error handling redirect:', error);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkRedirect();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;