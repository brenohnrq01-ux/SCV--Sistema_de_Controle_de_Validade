
'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Produto = {
  lote: string
  nome: string
  quantidade: number
  estado: string
  data_de_validade: string
}

export default function FormularioRemocao() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loteSelecionado, setLoteSelecionado] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const supabase = createClient()

  async function carregarProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select('lote, nome, quantidade, estado, data_de_validade')
      .neq('estado', 'REMOVIDO')
      .order('data_de_validade', { ascending: true })

    if (error) {
      setErro(`Erro ao carregar produtos: ${error.message}`)
      return
    }

    setProdutos(data ?? [])
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function removerProduto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErro('')
    setSucesso('')

    if (!loteSelecionado) {
      setErro('Selecione um produto.')
      return
    }

    const confirmar = window.confirm(
      `Deseja realmente remover o lote ${loteSelecionado}?`
    )

    if (!confirmar) {
      return
    }

    setCarregando(true)

    const { error } = await supabase.rpc('remover_produto', {
      p_lote: loteSelecionado,
    })

    if (error) {
      setErro(error.message)
      setCarregando(false)
      return
    }

    setSucesso('Produto removido com sucesso.')
    setLoteSelecionado('')

    await carregarProdutos()

    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 shadow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Remover Produto
            </h1>

            <p className="text-sm text-blue-100">
              Sistema de Controle de Validade
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

      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl bg-white p-8 shadow">
          <form onSubmit={removerProduto} className="space-y-6">
            <div>
              <label
                htmlFor="produto"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Produto
              </label>

              <select
                id="produto"
                value={loteSelecionado}
                onChange={(event) => setLoteSelecionado(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              >
                <option value="">
                  Selecione um produto
                </option>

                {produtos.map((produto) => (
                  <option
                    key={produto.lote}
                    value={produto.lote}
                  >
                    {produto.nome} — Lote {produto.lote} — Qtd. {produto.quantidade}
                  </option>
                ))}
              </select>
            </div>

            {erro && (
              <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="rounded-lg bg-green-100 p-4 text-sm text-green-700">
                {sucesso}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {carregando ? 'Removendo...' : 'Remover Produto'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
