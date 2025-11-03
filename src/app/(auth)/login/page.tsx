import { LoginForm } from '../components/LoginForm';
import { SessionSync } from '../../../components/session-sync';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center  p-4">
      <SessionSync />
      <LoginForm />
    </div>
  );
}