'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  FileText,
  PackageX,
  Search,
  TriangleAlert,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

type ProdutoPerdido = {
  lote: string
  nome: string
  valor_unitario: number | string
  quantidade: number
  valor_perdido: number | string
  data_de_validade: string
  estado: string
}

const meses = [
  { valor: 1, nome: 'Janeiro' },
  { valor: 2, nome: 'Fevereiro' },
  { valor: 3, nome: 'Março' },
  { valor: 4, nome: 'Abril' },
  { valor: 5, nome: 'Maio' },
  { valor: 6, nome: 'Junho' },
  { valor: 7, nome: 'Julho' },
  { valor: 8, nome: 'Agosto' },
  { valor: 9, nome: 'Setembro' },
  { valor: 10, nome: 'Outubro' },
  { valor: 11, nome: 'Novembro' },
  { valor: 12, nome: 'Dezembro' },
]

function moeda(valor: number | string) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function dataBrasil(data: string) {
  return new Date(
    `${data}T00:00:00`
  ).toLocaleDateString('pt-BR')
}

export default function RelatorioPerdasClient() {
  const router = useRouter()

  const agora = new Date()

  const [mes, setMes] = useState(
    agora.getMonth() + 1
  )

  const [ano, setAno] = useState(
    agora.getFullYear()
  )

  const [produtos, setProdutos] =
    useState<ProdutoPerdido[]>([])

  const [carregando, setCarregando] =
    useState(false)

  const [erro, setErro] = useState('')
  const [gerado, setGerado] = useState(false)

  const anos = useMemo(() => {
    const anoAtual = new Date().getFullYear()

    return Array.from(
      { length: 7 },
      (_, indice) => anoAtual - 5 + indice
    ).reverse()
  }, [])

  const totalUnidades = produtos.reduce(
    (total, produto) =>
      total + Number(produto.quantidade),
    0
  )

  const totalPerdido = produtos.reduce(
    (total, produto) =>
      total + Number(produto.valor_perdido),
    0
  )

  async function gerarRelatorio() {
    setCarregando(true)
    setErro('')
    setGerado(false)

    const supabase = createClient()

    const { data, error } = await supabase.rpc(
      'relatorio_perdas_mensal',
      {
        p_ano: ano,
        p_mes: mes,
      }
    )

    if (error) {
      setErro(
        `Erro ao gerar relatório: ${error.message}`
      )

      setProdutos([])
      setCarregando(false)
      return
    }

    setProdutos(
      (data ?? []) as ProdutoPerdido[]
    )

    setGerado(true)
    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* CABEÇALHO */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-rose-600 text-white shadow-lg shadow-red-600/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <FileText size={25} />
            </div>

            <div>
              <p className="text-sm font-medium text-red-100">
                SCV Alvorada
              </p>

              <h1 className="text-2xl font-black tracking-tight">
                Relatório de perdas
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push('/dashboard')
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
          >
            <ArrowLeft size={17} />
            Voltar
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* FILTRO */}
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 className="text-lg font-black text-zinc-900">
                Período do relatório
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Selecione o mês e o ano das perdas.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Mês
              </label>

              <select
                value={mes}
                onChange={(event) =>
                  setMes(Number(event.target.value))
                }
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              >
                {meses.map((item) => (
                  <option
                    key={item.valor}
                    value={item.valor}
                  >
                    {item.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-700">
                Ano
              </label>

              <select
                value={ano}
                onChange={(event) =>
                  setAno(Number(event.target.value))
                }
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              >
                {anos.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={gerarRelatorio}
              disabled={carregando}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-600/20 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {carregando ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Gerando...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Gerar relatório
                </>
              )}
            </button>
          </div>
        </section>

        {erro && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            {erro}
          </div>
        )}

        {gerado && (
          <>
            {/* RESUMO */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
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
                  {totalUnidades}
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-red-600 to-rose-600 p-6 text-white shadow-lg shadow-red-600/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <CircleDollarSign size={22} />
                </div>

                <p className="mt-5 text-sm font-medium text-red-100">
                  Valor total perdido
                </p>

                <p className="mt-1 break-words text-3xl font-black sm:text-4xl">
                  {moeda(totalPerdido)}
                </p>
              </div>
            </div>

            {/* SEM RESULTADOS */}
            {produtos.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
                <PackageX
                  className="mx-auto text-zinc-400"
                  size={38}
                />

                <h3 className="mt-4 text-lg font-black text-zinc-900">
                  Nenhuma perda encontrada
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Não existem produtos vencidos
                  registrados nesse período.
                </p>
              </div>
            ) : (
              <>
                {/* CELULAR */}
                <section className="mt-6 md:hidden">
                  <div className="mb-4">
                    <h2 className="text-lg font-black text-zinc-900">
                      Produtos vencidos
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      Detalhamento das perdas do
                      período selecionado.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {produtos.map(
                      (produto, indice) => (
                        <article
                          key={`${produto.nome}-${produto.lote}-${indice}`}
                          className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
                        >
                          <div className="border-b border-zinc-100 p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <span className="inline-flex rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-xs font-bold text-zinc-600">
                                  Lote {produto.lote}
                                </span>

                                <h3 className="mt-3 break-words text-lg font-black text-zinc-900">
                                  {produto.nome}
                                </h3>
                              </div>

                              <span className="shrink-0 rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white">
                                Vencido
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-5">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Quantidade
                              </p>

                              <p className="mt-1 font-bold text-zinc-900">
                                {
                                  produto.quantidade
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Valor unitário
                              </p>

                              <p className="mt-1 font-bold text-zinc-900">
                                {moeda(
                                  produto.valor_unitario
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Validade
                              </p>

                              <p className="mt-1 text-sm font-semibold text-zinc-700">
                                {dataBrasil(
                                  produto.data_de_validade
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Perda
                              </p>

                              <p className="mt-1 font-black text-red-600">
                                {moeda(
                                  produto.valor_perdido
                                )}
                              </p>
                            </div>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                </section>

                {/* TABLET / DESKTOP */}
                <section className="mt-6 hidden overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm md:block">
                  <div className="border-b border-zinc-200 p-6">
                    <h2 className="text-lg font-black text-zinc-900">
                      Produtos vencidos
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      Detalhamento das perdas do
                      período selecionado.
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
                            Validade
                          </th>

                          <th className="px-6 py-4">
                            Valor perdido
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {produtos.map(
                          (produto, indice) => (
                            <tr
                              key={`${produto.nome}-${produto.lote}-${indice}`}
                              className="border-t border-zinc-100 hover:bg-zinc-50/80"
                            >
                              <td className="px-6 py-5">
                                <span className="rounded-lg bg-zinc-100 px-2.5 py-1.5 font-mono text-sm font-bold text-zinc-700">
                                  {produto.lote}
                                </span>
                              </td>

                              <td className="px-6 py-5 font-bold text-zinc-900">
                                {produto.nome}
                              </td>

                              <td className="px-6 py-5 text-zinc-600">
                                {
                                  produto.quantidade
                                }
                              </td>

                              <td className="px-6 py-5 text-zinc-600">
                                {moeda(
                                  produto.valor_unitario
                                )}
                              </td>

                              <td className="px-6 py-5 text-zinc-600">
                                {dataBrasil(
                                  produto.data_de_validade
                                )}
                              </td>

                              <td className="px-6 py-5 font-black text-red-600">
                                {moeda(
                                  produto.valor_perdido
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        <footer className="py-10 text-center text-sm text-zinc-400">
          SCV • Sistema de Controle de Validade
        </footer>
      </div>
    </main>
  )
}
