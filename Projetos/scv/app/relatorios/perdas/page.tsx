'use client'

import { useState } from 'react'
import Link from 'next/link'
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

export default function RelatorioPerdasPage() {
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

    const supabase = createClient()

    const { data, error } = await supabase.rpc(
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

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Relatório de Perdas
            </h1>

            <p className="text-sm text-blue-100">
              Perdas mensais por produtos vencidos
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
        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Período do relatório
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mês
              </label>

              <select
                value={mes}
                onChange={(event) =>
                  setMes(Number(event.target.value))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              >
                {meses.map((nome, index) => (
                  <option
                    key={nome}
                    value={index + 1}
                  >
                    {nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Ano
              </label>

              <input
                type="number"
                value={ano}
                min="2020"
                max="2100"
                onChange={(event) =>
                  setAno(Number(event.target.value))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={gerarRelatorio}
                disabled={carregando}
                className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
              >
                {carregando
                  ? 'Gerando...'
                  : 'Gerar relatório'}
              </button>
            </div>
          </div>
        </div>

        {erro && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {erro}
          </div>
        )}

        {gerado && (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">
                  Produtos vencidos
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {produtos.length}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">
                  Valor perdido
                </p>

                <p className="mt-1 text-3xl font-bold text-red-600">
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

            <h2 className="mb-4 text-xl font-bold text-gray-900">
              {meses[mes - 1]} de {ano}
            </h2>

            {produtos.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center shadow">
                <h3 className="text-xl font-bold text-gray-900">
                  Nenhuma perda neste período
                </h3>

                <p className="mt-2 text-gray-600">
                  Não existem produtos vencidos no mês selecionado.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="w-full min-w-[850px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm text-gray-600">
                      <th className="px-5 py-4">
                        Lote
                      </th>

                      <th className="px-5 py-4">
                        Produto
                      </th>

                      <th className="px-5 py-4">
                        Quantidade
                      </th>

                      <th className="px-5 py-4">
                        Valor unitário
                      </th>

                      <th className="px-5 py-4">
                        Valor perdido
                      </th>

                      <th className="px-5 py-4">
                        Validade
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {produtos.map((produto) => (
                      <tr
                        key={produto.lote}
                        className="border-t border-gray-200 text-sm text-gray-700"
                      >
                        <td className="px-5 py-4 font-medium">
                          {produto.lote}
                        </td>

                        <td className="px-5 py-4">
                          {produto.nome}
                        </td>

                        <td className="px-5 py-4">
                          {produto.quantidade}
                        </td>

                        <td className="px-5 py-4">
                          {Number(
                            produto.valor_unitario
                          ).toLocaleString(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            }
                          )}
                        </td>

                        <td className="px-5 py-4 font-semibold text-red-600">
                          {Number(
                            produto.valor_perdido
                          ).toLocaleString(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            }
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {new Date(
                            `${produto.data_de_validade}T00:00:00`
                          ).toLocaleDateString(
                            'pt-BR'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
