import { LoginForm } from '../components/LoginForm';
import { SessionSync } from '../../../components/session-sync';

export default function LoginPage() {
  return (
    <>
      <SessionSync />
      <LoginForm />
    </>
  );
}