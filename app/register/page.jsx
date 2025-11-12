// app/register/page.jsx
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Créer un compte</h1>
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </main>
  );
}
