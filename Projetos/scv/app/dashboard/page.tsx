import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  await supabase.rpc('atualizar_produtos_vencidos')
  await supabase.rpc('gerar_notificacoes_validade')

  const { data: usuario, error } = await supabase
    .from('usuario')
    .select('nome, permissao')
    .eq('id', user.id)
    .single()

  if (error || !usuario) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Erro ao carregar usuário
          </h1>

          <p className="mt-2 text-gray-600">
            Não foi possível localizar o usuário no sistema.
          </p>
        </div>
      </main>
    )
  }

  const podeCadastrar = [
    'admin',
    'gerente',
    'estoquista',
    'operador',
  ].includes(usuario.permissao)

  const podeRemover = [
    'admin',
    'gerente',
    'estoquista',
  ].includes(usuario.permissao)

  const podeGerarRelatorio =
    usuario.permissao === 'admin'

  const podeGerenciarUsuarios =
    usuario.permissao === 'admin'

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const dataHoje =
    hoje.toISOString().split('T')[0]

  const dataLimite = new Date(hoje)
  dataLimite.setDate(
    dataLimite.getDate() + 19
  )

  const dataLimiteFormatada =
    dataLimite.toISOString().split('T')[0]

  const { count: totalAtivos } =
    await supabase
      .from('produtos')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .neq('estado', 'REMOVIDO')

  const { count: totalVencidos } =
    await supabase
      .from('produtos')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .neq('estado', 'REMOVIDO')
      .lt(
        'data_de_validade',
        dataHoje
      )

  const { count: totalUrgentes } =
    await supabase
      .from('produtos')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .neq('estado', 'REMOVIDO')
      .gte(
        'data_de_validade',
        dataHoje
      )
      .lte(
        'data_de_validade',
        dataLimiteFormatada
      )

  const {
  count: notificacoesNaoLidas,
} = await supabase
  .from('notificacao')
  .select('*', {
    count: 'exact',
    head: true,
  })
  .eq('usuario_id', user.id)
  .eq('visualizada', false)

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              SCV
            </h1>

            <p className="text-sm text-blue-100">
              Sistema de Controle de Validade
            </p>
          </div>

          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            Bem-vindo, {usuario.nome}
          </h2>

          <p className="mt-2 text-gray-600">
            Perfil:
            <span className="ml-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold capitalize text-blue-700">
              {usuario.permissao}
            </span>
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Produtos no estoque
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-600">
              {totalAtivos ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Vencidos
            </p>

            <p className="mt-1 text-3xl font-bold text-black">
              {totalVencidos ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Vencem em até 19 dias
            </p>

            <p className="mt-1 text-3xl font-bold text-red-600">
              {totalUrgentes ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Notificações não lidas
            </p>

            <p className="mt-1 text-3xl font-bold text-yellow-600">
              {notificacoesNaoLidas ?? 0}
            </p>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Menu principal
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/produtos"
            className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-900">
              Produtos
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Consulte os produtos e suas datas de validade.
            </p>

            <div className="mt-5">
              <span className="font-medium text-blue-600">
                Visualizar produtos
              </span>
            </div>
          </Link>

          {podeCadastrar && (
            <Link
              href="/produtos/cadastrar"
              className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Cadastrar Produto
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Cadastre novos produtos e lotes no estoque.
              </p>

              <div className="mt-5">
                <span className="font-medium text-green-600">
                  Novo cadastro
                </span>
              </div>
            </Link>
          )}

          {podeRemover && (
            <Link
              href="/produtos/remover"
              className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Remover Produto
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Registre a retirada de produtos ainda não vencidos.
              </p>

              <div className="mt-5">
                <span className="font-medium text-red-600">
                  Remover produto
                </span>
              </div>
            </Link>
          )}

         <Link
 	 href="/notificacoes"
	  className="relative rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
	>
 	 {(notificacoesNaoLidas ?? 0) > 0 && (
    	<span className="absolute right-4 top-4 flex min-h-7 min-w-7 items-center justify-center rounded-full bg-red-600 px-2 text-sm font-bold text-white">
     	 {notificacoesNaoLidas}
   	 </span>
 	 )}

 	 <h3 className="text-lg font-bold text-gray-900">
   	 Notificações
 	 </h3>

 	 <p className="mt-2 pr-10 text-sm text-gray-600">
   	 Consulte alertas relacionados à validade dos produtos.
 	 </p>

 	 <div className="mt-5">
   	 <span className="font-medium text-yellow-600">
     	 Ver notificações
   	 </span>
 	 </div>
	</Link>

          {podeGerarRelatorio && (
            <Link
              href="/relatorios/perdas"
              className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Relatório de Perdas
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Consulte perdas financeiras causadas por produtos vencidos.
              </p>

              <div className="mt-5">
                <span className="font-medium text-purple-600">
                  Gerar relatório
                </span>
              </div>
            </Link>
          )}

          {podeGerenciarUsuarios && (
            <Link
              href="/usuarios"
              className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Usuários
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Gerencie usuários e permissões do sistema.
              </p>

              <div className="mt-5">
                <span className="font-medium text-gray-700">
                  Gerenciar usuários
                </span>
              </div>
            </Link>
          )}
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Legenda de validade
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg bg-blue-600 p-4 text-center font-semibold text-white">
              90 dias ou mais
            </div>

            <div className="rounded-lg bg-green-600 p-4 text-center font-semibold text-white">
              50 a 89 dias
            </div>

            <div className="rounded-lg bg-yellow-400 p-4 text-center font-semibold text-gray-900">
              20 a 49 dias
            </div>

            <div className="rounded-lg bg-red-600 p-4 text-center font-semibold text-white">
              1 a 19 dias
            </div>

            <div className="rounded-lg bg-black p-4 text-center font-semibold text-white">
              Vencido
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
