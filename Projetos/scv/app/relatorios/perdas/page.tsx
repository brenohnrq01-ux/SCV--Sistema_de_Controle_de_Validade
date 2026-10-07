import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import RelatorioPerdasClient from './relatorio-client'

export default async function RelatorioPerdasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: perfilUsuario, error } = await supabase
    .from('usuario')
    .select('permissao')
    .eq('id', user.id)
    .single()

  if (error || !perfilUsuario) {
    redirect('/dashboard')
  }

  const podeAcessarRelatorio = [
    'admin',
    'dono',
  ].includes(perfilUsuario.permissao)

  if (!podeAcessarRelatorio) {
    redirect('/dashboard')
  }

  return <RelatorioPerdasClient />
}
