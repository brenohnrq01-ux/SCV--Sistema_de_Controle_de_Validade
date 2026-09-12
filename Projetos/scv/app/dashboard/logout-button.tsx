'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
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
      className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition duration-300 hover:bg-white hover:text-red-600"
    >
      <LogOut size={18} />
      Sair
    </button>
  )
}
