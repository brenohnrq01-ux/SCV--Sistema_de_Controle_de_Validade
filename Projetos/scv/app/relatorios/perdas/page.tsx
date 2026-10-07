import { redirect } from 'next/navigation'

import RelatorioPerdasClient from './relatorio-client'

import { createClient } from '@/lib/supabase/server'

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
}import { redirect } from 'next/navigation'

import RelatorioPerdasClient from './relatorio-client'

import { createClient } from '@/lib/supabase/server'

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
}import { redirect } from 'next/navigation'

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

  const { data: usuario, error } =
    await supabase
      .from('usuario')
      .select('permissao')
      .eq('id', user.id)
      .single()

  if (
  !['admin', 'dono'].includes(
    perfil?.permissao ?? ''
  )
) {
  redirect('/dashboard')
}

  return <RelatorioPerdasClient />
}
