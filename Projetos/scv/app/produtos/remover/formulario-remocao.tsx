'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  PackageX,
  Trash2,
  Warehouse,
} from 'lucide-react'

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
  const [carregandoProdutos, setCarregandoProdutos] = useState(true)

  const supabase = createClient()

  async function carregarProdutos() {
    setCarregandoProdutos(true)
    setErro('')

    const { data, error } = await supabase
      .from('produtos')
      .select(`
        lote,
        nome,
        quantidade,
        estado,
        data_de_validade
      `)
      .neq('estado', 'REMOVIDO')
      .order('data_de_validade', {
        ascending: true,
      })

    if (error) {
      setErro(
        `Erro ao carregar produtos: ${error.message}`
      )
      setCarregandoProdutos(false)
      return
    }

    setProdutos(data ?? [])
    setCarregandoProdutos(false)
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  const produtoSelecionado =
    produtos.find(
      (produto) =>
        produto.lote === loteSelecionado
    ) ?? null

  async function removerProduto(
    event: FormEvent<HTMLFormElement>
  ) {
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

    const { error } = await supabase.rpc(
      'remover_produto',
      {
        p_lote: loteSelecionado,
      }
    )

    if (error) {
      setErro(error.message)
      setCarregando(false)
      return
    }

    setSucesso(
      'Produto removido com sucesso.'
    )

    setLoteSelecionado('')

    await carregarProdutos()

    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-rose-600 shadow-lg">
        <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <PackageX size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                Remover Produto
              </h1>

              <p className="text-sm text-red-100">
                Registre a saída de produtos do estoque
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

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Estoque
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
            Registrar retirada
          </h2>

          <p className="mt-2 text-zinc-500">
            Selecione o produto que será retirado do estoque.
          </p>
        </div>

        <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h3 className="font-bold text-amber-900">
                Atenção
              </h3>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                A remoção não apaga o produto do sistema.
                O registro permanecerá no histórico com a data
                e o usuário responsável pela retirada.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Warehouse size={22} />
              </div>

              <div>
                <h3 className="font-bold text-zinc-900">
                  Produto
                </h3>

                <p className="text-sm text-zinc-500">
                  Somente produtos disponíveis para retirada aparecem aqui.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={removerProduto}
            className="space-y-6 p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="produto"
                className="mb-2 block text-sm font-semibold text-zinc-700"
              >
                Selecione o produto
              </label>

              <select
                id="produto"
                required
                disabled={carregandoProdutos}
                value={loteSelecionado}
                onChange={(event) =>
                  setLoteSelecionado(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 disabled:opacity-60"
              >
                <option value="">
                  {carregandoProdutos
                    ? 'Carregando produtos...'
                    : 'Selecione um produto'}
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

            {produtoSelecionado && (
              <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Produto
                  </p>

                  <p className="mt-1 font-semibold text-zinc-900">
                    {produtoSelecionado.nome}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Lote
                  </p>

                  <p className="mt-1 font-mono font-semibold text-zinc-900">
                    {produtoSelecionado.lote}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Quantidade
                  </p>

                  <p className="mt-1 font-semibold text-zinc-900">
                    {produtoSelecionado.quantidade}
                  </p>
                </div>
              </div>
            )}

            {erro && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                {sucesso}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard"
                className="rounded-xl border border-zinc-200 px-5 py-3 text-center font-semibold text-zinc-600 transition hover:bg-zinc-50"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={
                  carregando ||
                  carregandoProdutos ||
                  !loteSelecionado
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={18} />

                {carregando
                  ? 'Removendo...'
                  : 'Confirmar retirada'}
              </button>
            </div>
          </form>
        </div>

        <footer className="py-10 text-center text-sm text-zinc-400">
          SCV • Sistema de Controle de Validade
        </footer>
      </div>
    </main>
  )
}
