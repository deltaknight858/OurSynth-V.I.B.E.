
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
      <AuthForm mode="login" />
    </div>
  );
}
