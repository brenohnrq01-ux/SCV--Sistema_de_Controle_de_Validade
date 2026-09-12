'use client'

import { useMemo, useState } from 'react'

type Produto = {
  lote: string
  nome: string
  valor_unitario: number
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

  const validade = new Date(`${dataValidade}T00:00:00`)

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
      classe: 'bg-gray-500 text-white',
      faixa: 'removido',
    }
  }

  const dias = calcularDias(dataValidade)

  if (dias <= 0) {
    return {
      texto: 'Vencido',
      classe: 'bg-black text-white',
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
      classe: 'bg-yellow-400 text-gray-900',
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

      const termo = busca.toLowerCase().trim()

      const correspondeBusca =
        produto.nome.toLowerCase().includes(termo) ||
        produto.lote.toLowerCase().includes(termo)

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
    (produto) => produto.estado !== 'REMOVIDO'
  ).length

  const totalRemovidos = produtos.filter(
    (produto) => produto.estado === 'REMOVIDO'
  ).length

  const totalVencidos = produtos.filter((produto) => {
    return (
      produto.estado !== 'REMOVIDO' &&
      calcularDias(produto.data_de_validade) <= 0
    )
  }).length

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            No estoque
          </p>

          <p className="mt-1 text-3xl font-bold text-blue-600">
            {totalAtivos}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Vencidos
          </p>

          <p className="mt-1 text-3xl font-bold text-black">
            {totalVencidos}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Removidos
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-500">
            {totalRemovidos}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Buscar
            </label>

            <input
              type="text"
              value={busca}
              onChange={(event) =>
                setBusca(event.target.value)
              }
              placeholder="Nome ou lote..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Validade
            </label>

            <select
              value={faixa}
              onChange={(event) =>
                setFaixa(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
            >
              <option value="todos">
                Todas
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Estado
            </label>

            <select
              value={estado}
              onChange={(event) =>
                setEstado(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
            >
              <option value="todos">
                Todos
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
      </div>

      <div className="mb-3 text-sm text-gray-600">
        {produtosFiltrados.length} produto(s) encontrado(s)
      </div>

      {produtosFiltrados.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full min-w-[950px]">
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
                  Valor
                </th>

                <th className="px-5 py-4">
                  Entrega
                </th>

                <th className="px-5 py-4">
                  Validade
                </th>

                <th className="px-5 py-4">
                  Situação
                </th>

                <th className="px-5 py-4">
                  Estado
                </th>
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
                      ).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>

                    <td className="px-5 py-4">
                      {new Date(
                        `${produto.data_de_entrega}T00:00:00`
                      ).toLocaleDateString('pt-BR')}
                    </td>

                    <td className="px-5 py-4">
                      {new Date(
                        `${produto.data_de_validade}T00:00:00`
                      ).toLocaleDateString('pt-BR')}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status.classe}`}
                      >
                        {status.texto}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {produto.estado}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
