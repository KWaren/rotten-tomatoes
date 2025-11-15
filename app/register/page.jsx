import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">

      <h1 className="text-3xl font-bold mb-6 text-white">Créer un compte</h1>
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
      </div>
    </main>
  );
}
