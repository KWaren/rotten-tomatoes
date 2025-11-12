"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validators/auth";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await res.json();
    if (res.ok) {
      alert(
        "Inscription réussie — vérifiez votre email pour activer le compte."
      );
    } else {
      alert(payload.error || "Erreur");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Email" {...register("email")} />
      {errors.email && <div>{errors.email.message}</div>}

      <input placeholder="Password" type="password" {...register("password")} />
      {errors.password && <div>{errors.password.message}</div>}

      <input placeholder="Name" {...register("name")} />
      <button disabled={isSubmitting} type="submit">
        Register
      </button>
    </form>
  );
}
