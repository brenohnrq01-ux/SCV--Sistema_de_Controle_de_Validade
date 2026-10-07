import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  Bell,
  Box,
  Clock3,
  FileBarChart,
  Package,
  PackagePlus,
  PackageX,
  ShieldCheck,
  TriangleAlert,
  Users,
} from 'lucide-react'

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

  // Mantém produtos e notificações sincronizados.
  await supabase.rpc('atualizar_produtos_vencidos')
  await supabase.rpc('gerar_notificacoes_validade')

  const { data: usuario, error } = await supabase
    .from('usuario')
    .select('nome, permissao')
    .eq('id', user.id)
    .single()

  if (error || !usuario) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <TriangleAlert
            size={42}
            className="mx-auto text-red-600"
          />

          <h1 className="mt-5 text-2xl font-bold text-zinc-900">
            Erro ao carregar usuário
          </h1>

          <p className="mt-2 text-zinc-500">
            Não foi possível localizar o usuário no sistema.
          </p>
        </div>
      </main>
    )
  }

  const podeCadastrar = [
  'admin',
  'dono',
  'gerente',
  'estoquista',
  'operador',
].includes(permissao)

const podeRemover = [
  'admin',
  'dono',
  'gerente',
  'estoquista',
].includes(permissao)

const podeGerarRelatorio = [
  'admin',
  'dono',
].includes(permissao)

const podeGerenciarUsuarios =
  permissao === 'admin'

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
      .eq('estado', 'ATIVO')

  const { count: totalVencidos } =
    await supabase
      .from('produtos')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('estado', 'VENCIDO')

  const { count: totalUrgentes } =
    await supabase
      .from('produtos')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('estado', 'ATIVO')
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
    <main className="min-h-screen bg-zinc-50">
      {/* Cabeçalho */}
      <header className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-rose-600 shadow-lg">
        <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-rose-950/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <ShieldCheck size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                SCV
              </h1>

              <p className="text-sm text-red-100">
                Sistema de Controle de Validade
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Boas-vindas */}
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Visão geral
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900">
                Olá, {usuario.nome}
              </h2>

              <p className="mt-1 text-zinc-500">
                Veja como está o seu estoque hoje.
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold capitalize text-red-700">
              {usuario.permissao}
            </div>
          </div>
        </section>

        {/* Indicadores */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/produtos"
            className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                <Package size={24} />
              </div>

              <ArrowRight
                size={20}
                className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-red-600"
              />
            </div>

            <p className="mt-6 text-sm font-medium text-zinc-500">
              Produtos ativos
            </p>

            <p className="mt-1 text-4xl font-black text-zinc-900">
              {totalAtivos ?? 0}
            </p>
          </Link>

          <Link
            href="/produtos"
            className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900">
                <Box size={24} />
              </div>

              <ArrowRight
                size={20}
                className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-zinc-700"
              />
            </div>

            <p className="mt-6 text-sm font-medium text-zinc-500">
              Produtos vencidos
            </p>

            <p className="mt-1 text-4xl font-black text-zinc-900">
              {totalVencidos ?? 0}
            </p>
          </Link>

          <Link
            href="/produtos"
            className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                <Clock3 size={24} />
              </div>

              <ArrowRight
                size={20}
                className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-red-600"
              />
            </div>

            <p className="mt-6 text-sm font-medium text-zinc-500">
              Vencem em até 19 dias
            </p>

            <p className="mt-1 text-4xl font-black text-red-600">
              {totalUrgentes ?? 0}
            </p>
          </Link>

          <Link
            href="/notificacoes"
            className="group relative rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl"
          >
            {(notificacoesNaoLidas ?? 0) > 0 && (
              <span className="absolute right-5 top-5 flex min-h-7 min-w-7 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-bold text-white shadow-lg shadow-red-600/30">
                {notificacoesNaoLidas}
              </span>
            )}

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Bell size={24} />
            </div>

            <p className="mt-6 text-sm font-medium text-zinc-500">
              Notificações não lidas
            </p>

            <p className="mt-1 text-4xl font-black text-zinc-900">
              {notificacoesNaoLidas ?? 0}
            </p>
          </Link>
        </section>

        {/* Acesso rápido */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Navegação
            </p>

            <h2 className="mt-1 text-2xl font-black text-zinc-900">
              Acesso rápido
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/produtos"
              className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                <Package size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-zinc-900">
                Produtos
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Consulte estoque, lotes e datas de validade.
              </p>

              <div className="mt-6 flex items-center gap-2 font-semibold text-red-600">
                Visualizar produtos
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>

            {podeCadastrar && (
              <Link
                href="/produtos/cadastrar"
                className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                  <PackagePlus size={24} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-zinc-900">
                  Cadastrar Produto
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Adicione um novo produto e lote ao estoque.
                </p>

                <div className="mt-6 flex items-center gap-2 font-semibold text-red-600">
                  Novo cadastro
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            )}

            {podeRemover && (
              <Link
                href="/produtos/remover"
                className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                  <PackageX size={24} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-zinc-900">
                  Remover Produto
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Registre a saída de um produto do estoque.
                </p>

                <div className="mt-6 flex items-center gap-2 font-semibold text-red-600">
                  Remover produto
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            )}

            <Link
              href="/notificacoes"
              className="group relative rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
            >
              {(notificacoesNaoLidas ?? 0) > 0 && (
                <span className="absolute right-5 top-5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                  {notificacoesNaoLidas}
                </span>
              )}

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                <Bell size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-zinc-900">
                Notificações
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Veja alertas relacionados aos vencimentos.
              </p>

              <div className="mt-6 flex items-center gap-2 font-semibold text-red-600">
                Ver notificações
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>

            {podeGerarRelatorio && (
              <Link
                href="/relatorios/perdas"
                className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                  <FileBarChart size={24} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-zinc-900">
                  Relatório de Perdas
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Consulte as perdas causadas por produtos vencidos.
                </p>

                <div className="mt-6 flex items-center gap-2 font-semibold text-red-600">
                  Abrir relatório
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            )}

            {podeGerenciarUsuarios && (
              <Link
                href="/usuarios"
                className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                  <Users size={24} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-zinc-900">
                  Usuários
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Consulte e gerencie as permissões do sistema.
                </p>

                <div className="mt-6 flex items-center gap-2 font-semibold text-red-600">
                  Gerenciar usuários
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Legenda */}
        <section className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <TriangleAlert
              size={22}
              className="text-red-600"
            />

            <h2 className="text-xl font-bold text-zinc-900">
              Indicadores de validade
            </h2>
          </div>

          <p className="mt-1 text-sm text-zinc-500">
            As cores indicam quanto tempo resta para o produto vencer.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl bg-blue-600 p-4 text-center text-sm font-bold text-white">
              90 dias ou mais
            </div>

            <div className="rounded-2xl bg-green-600 p-4 text-center text-sm font-bold text-white">
              50 a 89 dias
            </div>

            <div className="rounded-2xl bg-yellow-400 p-4 text-center text-sm font-bold text-zinc-900">
              20 a 49 dias
            </div>

            <div className="rounded-2xl bg-red-600 p-4 text-center text-sm font-bold text-white">
              1 a 19 dias
            </div>

            <div className="rounded-2xl bg-zinc-950 p-4 text-center text-sm font-bold text-white">
              Vencido
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-sm text-zinc-400">
          SCV • Sistema de Controle de Validade
        </footer>
      </div>
    </main>
  )
}
