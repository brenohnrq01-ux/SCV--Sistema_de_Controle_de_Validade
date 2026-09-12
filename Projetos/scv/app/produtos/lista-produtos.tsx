'use client'

import { useMemo, useState } from 'react'
import {
  Archive,
  CircleX,
  Filter,
  PackageCheck,
  RotateCcw,
  Search,
  TriangleAlert,
} from 'lucide-react'

type Produto = {
  lote: string
  nome: string
  valor_unitario: number | string
  quantidade: number
  estado: string
  data_de_entrega: string
  data_de_validade: string
  data_remocao: string | null
}

type Props = {
  produtos: Produto[]
}

function calcularDias(dataValidade: string) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const validade = new Date(
    `${dataValidade}T00:00:00`
  )

  return Math.ceil(
    (validade.getTime() - hoje.getTime()) /
      (1000 * 60 * 60 * 24)
  )
}

function statusValidade(
  dataValidade: string,
  estado: string
) {
  if (estado === 'REMOVIDO') {
    return {
      texto: 'Removido',
      classe: 'bg-zinc-500 text-white',
      faixa: 'removido',
    }
  }

  const dias = calcularDias(dataValidade)

  if (dias <= 0) {
    return {
      texto: 'Vencido',
      classe: 'bg-zinc-950 text-white',
      faixa: 'vencido',
    }
  }

  if (dias >= 90) {
    return {
      texto: `${dias} dias`,
      classe: 'bg-blue-600 text-white',
      faixa: 'azul',
    }
  }

  if (dias >= 50) {
    return {
      texto: `${dias} dias`,
      classe: 'bg-green-600 text-white',
      faixa: 'verde',
    }
  }

  if (dias >= 20) {
    return {
      texto: `${dias} dias`,
      classe: 'bg-yellow-400 text-zinc-950',
      faixa: 'amarelo',
    }
  }

  return {
    texto: `${dias} dias`,
    classe: 'bg-red-600 text-white',
    faixa: 'vermelho',
  }
}

export default function ListaProdutos({
  produtos,
}: Props) {
  const [busca, setBusca] = useState('')
  const [faixa, setFaixa] = useState('todos')
  const [estado, setEstado] = useState('todos')

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const status = statusValidade(
        produto.data_de_validade,
        produto.estado
      )

      const termo = busca
        .toLowerCase()
        .trim()

      const correspondeBusca =
        produto.nome
          .toLowerCase()
          .includes(termo) ||
        produto.lote
          .toLowerCase()
          .includes(termo)

      const correspondeFaixa =
        faixa === 'todos' ||
        status.faixa === faixa

      const correspondeEstado =
        estado === 'todos' ||
        produto.estado === estado

      return (
        correspondeBusca &&
        correspondeFaixa &&
        correspondeEstado
      )
    })
  }, [produtos, busca, faixa, estado])

  const totalAtivos = produtos.filter(
    (produto) => produto.estado === 'ATIVO'
  ).length

  const totalVencidos = produtos.filter(
    (produto) =>
      produto.estado !== 'REMOVIDO' &&
      calcularDias(produto.data_de_validade) <= 0
  ).length

  const totalRemovidos = produtos.filter(
    (produto) => produto.estado === 'REMOVIDO'
  ).length

  function limparFiltros() {
    setBusca('')
    setFaixa('todos')
    setEstado('todos')
  }

  return (
    <>
      {/* CONTADORES */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <PackageCheck size={22} />
          </div>

          <p className="mt-5 text-sm font-medium text-zinc-500">
            Produtos ativos
          </p>

          <p className="mt-1 text-4xl font-black text-zinc-900">
            {totalAtivos}
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-950">
            <TriangleAlert size={22} />
          </div>

          <p className="mt-5 text-sm font-medium text-zinc-500">
            Produtos vencidos
          </p>

          <p className="mt-1 text-4xl font-black text-zinc-900">
            {totalVencidos}
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
            <Archive size={22} />
          </div>

          <p className="mt-5 text-sm font-medium text-zinc-500">
            Produtos removidos
          </p>

          <p className="mt-1 text-4xl font-black text-zinc-900">
            {totalRemovidos}
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Filter size={20} />
          </div>

          <div>
            <h3 className="font-bold text-zinc-900">
              Filtros
            </h3>

            <p className="text-sm text-zinc-500">
              Encontre rapidamente um produto.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Buscar
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                type="text"
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
                placeholder="Nome ou lote..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Validade
            </label>

            <select
              value={faixa}
              onChange={(event) =>
                setFaixa(event.target.value)
              }
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            >
              <option value="todos">
                Todas as faixas
              </option>
              <option value="azul">
                90 dias ou mais
              </option>
              <option value="verde">
                50 a 89 dias
              </option>
              <option value="amarelo">
                20 a 49 dias
              </option>
              <option value="vermelho">
                1 a 19 dias
              </option>
              <option value="vencido">
                Vencidos
              </option>
              <option value="removido">
                Removidos
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Estado
            </label>

            <select
              value={estado}
              onChange={(event) =>
                setEstado(event.target.value)
              }
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            >
              <option value="todos">
                Todos os estados
              </option>
              <option value="ATIVO">
                ATIVO
              </option>
              <option value="VENCIDO">
                VENCIDO
              </option>
              <option value="REMOVIDO">
                REMOVIDO
              </option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            <strong className="text-zinc-900">
              {produtosFiltrados.length}
            </strong>{' '}
            produto(s) encontrado(s)
          </p>

          <button
            type="button"
            onClick={limparFiltros}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <RotateCcw size={16} />
            Limpar filtros
          </button>
        </div>
      </div>

      {/* PRODUTOS */}
      <div className="mt-8">
        {produtosFiltrados.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
              <CircleX size={26} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-zinc-900">
              Nenhum produto encontrado
            </h3>

            <p className="mt-2 text-zinc-500">
              Altere os filtros ou faça uma nova busca.
            </p>
          </div>
        ) : (
          <>
            {/* CELULAR */}
            <div className="space-y-4 md:hidden">
              {produtosFiltrados.map((produto) => {
                const status = statusValidade(
                  produto.data_de_validade,
                  produto.estado
                )

                return (
                  <article
                    key={produto.lote}
                    className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
                  >
                    <div className="border-b border-zinc-100 p-5">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-xs font-bold text-zinc-600">
                            Lote {produto.lote}
                          </span>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${status.classe}`}
                          >
                            {status.texto}
                          </span>
                        </div>

                        <h3 className="break-words text-lg font-bold text-zinc-900">
                          {produto.nome}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Quantidade
                        </p>

                        <p className="mt-1 font-semibold text-zinc-900">
                          {produto.quantidade}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Valor
                        </p>

                        <p className="mt-1 font-semibold text-zinc-900">
                          {Number(
                            produto.valor_unitario
                          ).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Entrega
                        </p>

                        <p className="mt-1 text-sm font-medium text-zinc-700">
                          {new Date(
                            `${produto.data_de_entrega}T00:00:00`
                          ).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Validade
                        </p>

                        <p className="mt-1 text-sm font-medium text-zinc-700">
                          {new Date(
                            `${produto.data_de_validade}T00:00:00`
                          ).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-5 py-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Estado
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          produto.estado === 'REMOVIDO'
                            ? 'text-zinc-400'
                            : produto.estado === 'VENCIDO'
                              ? 'text-zinc-950'
                              : 'text-green-600'
                        }`}
                      >
                        {produto.estado}
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* TABLET E COMPUTADOR */}
            <div className="hidden overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                      <th className="px-6 py-4">Lote</th>
                      <th className="px-6 py-4">Produto</th>
                      <th className="px-6 py-4">Quantidade</th>
                      <th className="px-6 py-4">Valor</th>
                      <th className="px-6 py-4">Entrega</th>
                      <th className="px-6 py-4">Validade</th>
                      <th className="px-6 py-4">Situação</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {produtosFiltrados.map((produto) => {
                      const status = statusValidade(
                        produto.data_de_validade,
                        produto.estado
                      )

                      return (
                        <tr
                          key={produto.lote}
                          className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80"
                        >
                          <td className="px-6 py-5">
                            <span className="rounded-lg bg-zinc-100 px-2.5 py-1.5 font-mono text-sm font-semibold text-zinc-700">
                              {produto.lote}
                            </span>
                          </td>

                          <td className="px-6 py-5 font-semibold text-zinc-900">
                            {produto.nome}
                          </td>

                          <td className="px-6 py-5 text-zinc-600">
                            {produto.quantidade}
                          </td>

                          <td className="px-6 py-5 font-medium text-zinc-700">
                            {Number(
                              produto.valor_unitario
                            ).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </td>

                          <td className="px-6 py-5 text-zinc-600">
                            {new Date(
                              `${produto.data_de_entrega}T00:00:00`
                            ).toLocaleDateString('pt-BR')}
                          </td>

                          <td className="px-6 py-5 text-zinc-600">
                            {new Date(
                              `${produto.data_de_validade}T00:00:00`
                            ).toLocaleDateString('pt-BR')}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${status.classe}`}
                            >
                              {status.texto}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`text-xs font-bold ${
                                produto.estado === 'REMOVIDO'
                                  ? 'text-zinc-400'
                                  : produto.estado === 'VENCIDO'
                                    ? 'text-zinc-950'
                                    : 'text-green-600'
                              }`}
                            >
                              {produto.estado}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
