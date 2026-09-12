'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  FileBarChart,
  PackageX,
  Search,
  TriangleAlert,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

type ProdutoPerda = {
  lote: string
  nome: string
  valor_unitario: number
  quantidade: number
  valor_perdido: number
  data_de_validade: string
  estado: string
}

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export default function RelatorioPerdasClient() {
  const hoje = new Date()

  const [mes, setMes] = useState(
    hoje.getMonth() + 1
  )

  const [ano, setAno] = useState(
    hoje.getFullYear()
  )

  const [produtos, setProdutos] =
    useState<ProdutoPerda[]>([])

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] =
    useState(false)

  const [gerado, setGerado] =
    useState(false)

  async function gerarRelatorio() {
    setErro('')
    setCarregando(true)
    setGerado(false)

    const supabase = createClient()

    const { data, error } =
      await supabase.rpc(
        'relatorio_perdas_mensal',
        {
          p_ano: ano,
          p_mes: mes,
        }
      )

    if (error) {
      setErro(error.message)
      setProdutos([])
      setCarregando(false)
      return
    }

    setProdutos(data ?? [])
    setGerado(true)
    setCarregando(false)
  }

  const valorTotal = produtos.reduce(
    (total, produto) =>
      total + Number(produto.valor_perdido),
    0
  )

  const quantidadeTotal = produtos.reduce(
    (total, produto) =>
      total + Number(produto.quantidade),
    0
  )

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-rose-600 shadow-lg">
        <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <FileBarChart size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                Relatório de Perdas
              </h1>

              <p className="text-sm text-red-100">
                Análise mensal de produtos vencidos
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

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Gestão financeira
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
            Perdas por vencimento
          </h2>

          <p className="mt-2 text-zinc-500">
            Selecione um período para visualizar os produtos
            vencidos e o impacto financeiro.
          </p>
        </div>

        {/* Filtros */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <CalendarDays size={22} />
            </div>

            <div>
              <h3 className="font-bold text-zinc-900">
                Período do relatório
              </h3>

              <p className="text-sm text-zinc-500">
                Escolha o mês e o ano.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Mês
              </label>

              <select
                value={mes}
                onChange={(event) =>
                  setMes(
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              >
                {meses.map(
                  (nome, index) => (
                    <option
                      key={nome}
                      value={index + 1}
                    >
                      {nome}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Ano
              </label>

              <input
                type="number"
                value={ano}
                min="2020"
                max="2100"
                onChange={(event) =>
                  setAno(
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={gerarRelatorio}
                disabled={carregando}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search size={18} />

                {carregando
                  ? 'Gerando...'
                  : 'Gerar relatório'}
              </button>
            </div>
          </div>
        </section>

        {erro && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {erro}
          </div>
        )}

        {carregando && (
          <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-red-600" />

            <p className="mt-5 font-medium text-zinc-500">
              Calculando perdas...
            </p>
          </div>
        )}

        {gerado && !carregando && (
          <>
            <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                  Resultado
                </p>

                <h2 className="mt-1 text-2xl font-black text-zinc-900">
                  {meses[mes - 1]} de {ano}
                </h2>
              </div>
            </div>

            {/* Indicadores */}
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <PackageX size={22} />
                </div>

                <p className="mt-5 text-sm font-medium text-zinc-500">
                  Lotes vencidos
                </p>

                <p className="mt-1 text-4xl font-black text-zinc-900">
                  {produtos.length}
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <TriangleAlert size={22} />
                </div>

                <p className="mt-5 text-sm font-medium text-zinc-500">
                  Unidades perdidas
                </p>

                <p className="mt-1 text-4xl font-black text-zinc-900">
                  {quantidadeTotal}
                </p>
              </div>

              <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-600 to-rose-600 p-6 text-white shadow-lg shadow-red-600/15">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <CircleDollarSign size={22} />
                </div>

                <p className="mt-5 text-sm font-medium text-red-100">
                  Valor total perdido
                </p>

                <p className="mt-1 text-4xl font-black">
                  {valorTotal.toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    }
                  )}
                </p>
              </div>
            </div>

            {/* Tabela */}
            <div className="mt-8">
              {produtos.length === 0 ? (
                <div className="rounded-3xl border border-green-200 bg-white p-12 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <FileBarChart size={27} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-zinc-900">
                    Nenhuma perda neste período
                  </h3>

                  <p className="mt-2 text-zinc-500">
                    Não existem produtos vencidos no mês selecionado.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                  <div className="border-b border-zinc-200 px-6 py-5">
                    <h3 className="font-bold text-zinc-900">
                      Produtos vencidos
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Detalhamento das perdas do período selecionado.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                      <thead>
                        <tr className="bg-zinc-50 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                          <th className="px-6 py-4">
                            Lote
                          </th>

                          <th className="px-6 py-4">
                            Produto
                          </th>

                          <th className="px-6 py-4">
                            Quantidade
                          </th>

                          <th className="px-6 py-4">
                            Valor unitário
                          </th>

                          <th className="px-6 py-4">
                            Valor perdido
                          </th>

                          <th className="px-6 py-4">
                            Validade
                          </th>

                          <th className="px-6 py-4">
                            Situação
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {produtos.map(
                          (produto) => (
                            <tr
                              key={
                                produto.lote
                              }
                              className="border-t border-zinc-100 transition hover:bg-zinc-50"
                            >
                              <td className="px-6 py-5">
                                <span className="rounded-lg bg-zinc-100 px-2.5 py-1.5 font-mono text-sm font-semibold text-zinc-700">
                                  {
                                    produto.lote
                                  }
                                </span>
                              </td>

                              <td className="px-6 py-5 font-semibold text-zinc-900">
                                {
                                  produto.nome
                                }
                              </td>

                              <td className="px-6 py-5 text-zinc-600">
                                {
                                  produto.quantidade
                                }
                              </td>

                              <td className="px-6 py-5 text-zinc-700">
                                {Number(
                                  produto.valor_unitario
                                ).toLocaleString(
                                  'pt-BR',
                                  {
                                    style:
                                      'currency',
                                    currency:
                                      'BRL',
                                  }
                                )}
                              </td>

                              <td className="px-6 py-5 font-bold text-red-600">
                                {Number(
                                  produto.valor_perdido
                                ).toLocaleString(
                                  'pt-BR',
                                  {
                                    style:
                                      'currency',
                                    currency:
                                      'BRL',
                                  }
                                )}
                              </td>

                              <td className="px-6 py-5 text-zinc-600">
                                {new Date(
                                  `${produto.data_de_validade}T00:00:00`
                                ).toLocaleDateString(
                                  'pt-BR'
                                )}
                              </td>

                              <td className="px-6 py-5">
                                <span className="rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white">
                                  VENCIDO
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!gerado &&
          !carregando && (
            <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-white/50 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <FileBarChart size={27} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-zinc-900">
                Gere seu relatório
              </h3>

              <p className="mx-auto mt-2 max-w-md text-zinc-500">
                Selecione um mês e um ano acima para analisar as perdas do período.
              </p>
            </div>
          )}

        <footer className="py-10 text-center text-sm text-zinc-400">
          SCV • Sistema de Controle de Validade
        </footer>
      </div>
    </main>
  )
}
