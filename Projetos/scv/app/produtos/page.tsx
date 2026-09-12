import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Package } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import ListaProdutos from './lista-produtos'

export default async function ProdutosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  await supabase.rpc('atualizar_produtos_vencidos')

  const { data: produtos, error } = await supabase
    .from('produtos')
    .select(`
      lote,
      nome,
      valor_unitario,
      quantidade,
      estado,
      data_de_entrega,
      data_de_validade,
      data_remocao
    `)
    .order('data_de_validade', {
      ascending: true,
    })

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black text-red-600">
            Erro ao carregar produtos
          </h1>

          <p className="mt-3 text-zinc-500">
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

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <Package size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                Produtos
              </h1>

              <p className="text-sm text-red-100">
                Controle de estoque e validade
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="relative flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-red-600"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Estoque
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
            Visão dos produtos
          </h2>

          <p className="mt-2 text-zinc-500">
            Consulte lotes, datas de validade e situação dos produtos.
          </p>
        </div>

        <ListaProdutos produtos={produtos ?? []} />

        <footer className="py-10 text-center text-sm text-zinc-400">
          SCV • Sistema de Controle de Validade
        </footer>
      </div>
    </main>
  )
}
