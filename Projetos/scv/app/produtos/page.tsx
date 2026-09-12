import Link from 'next/link'
import { redirect } from 'next/navigation'
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
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-7xl rounded-xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Erro ao carregar produtos
          </h1>

          <p className="mt-2 text-gray-600">
            {error.message}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Produtos
            </h1>

            <p className="text-sm text-blue-100">
              Controle de validade e estoque
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

      <div className="mx-auto max-w-7xl p-6">
        <ListaProdutos produtos={produtos ?? []} />
      </div>
    </main>
  )
}
