'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/validators/auth';

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data) {
    setServerError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const payload = await res.json();

      if (res.ok) {
        router.push('/verify-email');
      } else {
        setServerError(payload.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error(err);
      setServerError('Erreur serveur');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error :</strong>
          <span className="block sm:inline ml-1">{serverError}</span>
        </div>
      )}

      <input
        type="text"
        placeholder="Name"
        {...register('name')}
        className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
      />
      {errors.name && <div className="text-red-400 text-sm">{errors.name.message}</div>}

      <input
        type="text"
        placeholder="Surname"
        {...register('surname')}
        className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
      />
      {errors.surname && <div className="text-red-400 text-sm">{errors.surname.message}</div>}

      <input
        type="email"
        placeholder="Email"
        {...register('email')}
        className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
      />
      {errors.email && <div className="text-red-400 text-sm">{errors.email.message}</div>}

      <input
        type="password"
        placeholder="Password"
        {...register('password')}
        className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
      />
      {errors.password && <div className="text-red-400 text-sm">{errors.password.message}</div>}

      <input
        type="text"
        placeholder="Profession"
        {...register('profession')}
        className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
      />
      {errors.profession && <div className="text-red-400 text-sm">{errors.profession.message}</div>}

      <input
        type="date"
        placeholder="Birthday"
        {...register('birthday')}
        className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
      />
      {errors.birthday && <div className="text-red-400 text-sm">{errors.birthday.message}</div>}

      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all"
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
