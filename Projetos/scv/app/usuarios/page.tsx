import Link from 'next/link'
import { redirect } from 'next/navigation'
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

  if (!usuarioAtual || usuarioAtual.permissao !== 'admin') {
    redirect('/dashboard')
  }

  const { data: usuarios, error } = await supabase
    .from('usuario')
    .select('id, nome, permissao')
    .order('nome', { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Erro ao carregar usuários
          </h1>

          <p className="mt-2 text-gray-600">
            {error.message}
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Voltar
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Gerenciamento de Usuários
            </h1>

            <p className="text-sm text-blue-100">
              Controle de permissões do SCV
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg bg-white px-4 py-2 font-medium text-blue-700"
          >
            Voltar
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-6">
        <ListaUsuarios
          usuarios={usuarios ?? []}
          usuarioAtualId={user.id}
        />
      </div>
    </main>
  )
}
