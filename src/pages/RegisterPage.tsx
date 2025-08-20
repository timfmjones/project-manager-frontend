import { RegisterForm } from '../components/auth/RegisterForm';
import { GuestCTA } from '../components/auth/GuestCTA';

export function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <RegisterForm />
        <GuestCTA />
      </div>
    </div>
  );
}