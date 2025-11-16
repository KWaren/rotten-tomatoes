'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            router.push('/');
            return;
          }
        }
      } catch (err) {
        console.log('User not logged in');
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(''); 

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/');
    } else {
      setError(data.error || 'Invalid credentials'); // <-- afficher dans la page
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
        <h1 className="text-2xl font-bold text-center text-white mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border rounded-lg border-red-400 text-red-700  px-4 py-3 relative mt-4" role="alert">
              <strong className="font-bold">Error :</strong>
              <span className="block sm:inline ml-1">{error}</span>
            </div>
          )}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
              required
            />
          </div>

          {/* {error && (
            <p className="text-red-500 text-sm text-center">{error}</p> // <-- message d'erreur visible
          )} */}

          <button
            type="submit"
            className="w-full cursor-pointer bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-white mt-4">
          Don’t have an account?{' '}
          <Link href="/register" className="text-red-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
