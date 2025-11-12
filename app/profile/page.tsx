"use client"

import { useSession } from "next-auth/react"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Chargement...</p>
  if (!session) return <p>Accès refusé. Veuillez vous connecter.</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <p>Email : {session.user?.email}</p>
      <p>Rôle : {session.user?.role}</p>
    </div>
  )
}
