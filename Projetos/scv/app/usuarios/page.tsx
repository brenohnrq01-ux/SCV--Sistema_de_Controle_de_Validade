import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowLeft,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import ListaUsuarios from './lista-usuarios'

export default async function UsuariosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: usuarioAtual } = await supabase
    .from('usuario')
    .select('permissao')
    .eq('id', user.id)
    .single()

  if (
    !usuarioAtual ||
    usuarioAtual.permissao !== 'admin'
  ) {
    redirect('/dashboard')
  }

  const { data: usuarios, error } =
    await supabase
      .from('usuario')
      .select('id, nome, permissao')
      .order('nome', {
        ascending: true,
      })

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <Users
            size={42}
            className="mx-auto text-red-600"
          />

          <h1 className="mt-5 text-2xl font-black text-zinc-900">
            Erro ao carregar usuários
          </h1>

          <p className="mt-2 text-zinc-500">
            {error.message}
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-rose-600 shadow-lg">
        <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                Usuários
              </h1>

              <p className="text-sm text-red-100">
                Gerenciamento de permissões do SCV
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-red-600"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Administração
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
            Controle de usuários
          </h2>

          <p className="mt-2 text-zinc-500">
            Consulte os usuários cadastrados e gerencie suas permissões.
          </p>
        </div>

        <ListaUsuarios
          usuarios={usuarios ?? []}
          usuarioAtualId={user.id}
        />

        <footer className="py-10 text-center text-sm text-zinc-400">
          SCV • Sistema de Controle de Validade
        </footer>
      </div>
    </main>
  )
}
