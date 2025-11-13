export default function VerifyEmailPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Check your email </h1>
        <p className="text-white/90 mb-6">
          We’ve sent you a verification link to confirm your account.  
          Please check your inbox (and spam folder just in case).
        </p>

        <div className="mt-4">
          <p className="text-sm text-white/80">
            Didn’t get the email?{' '}
            <a
              href="#"
              className="text-red-400 hover:underline font-medium"
            >
              Resend verification link
            </a>
          </p>
        </div>

        <div className="mt-8">
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
          >
            Back to Login
          </a>
        </div>
      </div>
    </main>
  );
}
