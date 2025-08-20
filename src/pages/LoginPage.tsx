import { LoginForm } from '../components/auth/LoginForm';
import { GuestCTA } from '../components/auth/GuestCTA';

export function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <LoginForm />
        <GuestCTA />
      </div>
    </div>
  );
}