import { RegisterForm } from '../components/auth/RegisterForm';
import { GuestCTA } from '../components/auth/GuestCTA';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';

export function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        
        {/* Google Sign-In */}
        <div className="mb-4">
          <GoogleSignInButton />
        </div>
        
        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or register with email</span>
          </div>
        </div>
        
        {/* Email/Password Form */}
        <RegisterForm />
        
        {/* Guest Option */}
        <GuestCTA />
      </div>
    </div>
  );
}