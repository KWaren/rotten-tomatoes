"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validators/auth";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await res.json();
    if (res.ok) {
      // session cookie set by server
      window.location.href = "/dashboard";
    } else {
      alert(payload.error || "Erreur de connexion");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Email" {...register("email")} />
      {errors.email && <div>{errors.email.message}</div>}
      <input type="password" placeholder="Password" {...register("password")} />
      {errors.password && <div>{errors.password.message}</div>}
      <button type="submit">Se connecter</button>
    </form>
  );
}
