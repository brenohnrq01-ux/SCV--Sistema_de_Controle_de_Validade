'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  async function sair() {
    const supabase = createClient()

    await supabase.auth.signOut()

    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={sair}
      className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
    >
      Sair
    </button>
  )
}
