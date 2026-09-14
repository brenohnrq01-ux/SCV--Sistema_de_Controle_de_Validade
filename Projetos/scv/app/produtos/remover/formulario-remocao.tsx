'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  PackageMinus,
  Trash2,
  TriangleAlert,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

type Produto = {
  id: number
  lote: string
  nome: string
  quantidade: number
  estado: string
  data_de_validade: string
}

export default function FormularioRemocao() {
  const router = useRouter()

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtoId, setProdutoId] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [removendo, setRemovendo] = useState(false)

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    setCarregando(true)
    setErro('')

    const supabase = createClient()

    const hoje = new Date()
    const hojeFormatado = [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, '0'),
      String(hoje.getDate()).padStart(2, '0'),
    ].join('-')

    const { data, error } = await supabase
      .from('produtos')
      .select(
        `
          id,
          lote,
          nome,
          quantidade,
          estado,
          data_de_validade
        `
      )
      .eq('estado', 'ATIVO')
      .gt('data_de_validade', hojeFormatado)
      .order('data_de_validade', {
        ascending: true,
      })
      .order('nome', {
        ascending: true,
      })

    if (error) {
      setErro(
        `Erro ao carregar produtos: ${error.message}`
      )

      setCarregando(false)
      return
    }

    const lista = (data ?? []) as Produto[]

    setProdutos(lista)

    if (lista.length > 0) {
      setProdutoId(String(lista[0].id))
    } else {
      setProdutoId('')
    }

    setCarregando(false)
  }

  const produtoSelecionado = useMemo(() => {
    return produtos.find(
      (produto) =>
        String(produto.id) === produtoId
    )
  }, [produtos, produtoId])

  async function removerProduto() {
    setErro('')
    setSucesso('')

    if (!produtoSelecionado) {
      setErro('Selecione um produto.')
      return
    }

    const confirmar = window.confirm(
      `Deseja realmente retirar "${produtoSelecionado.nome}", lote ${produtoSelecionado.lote}?`
    )

    if (!confirmar) {
      return
    }

    setRemovendo(true)

    const supabase = createClient()

    const { error } = await supabase.rpc(
      'remover_produto',
      {
        p_produto_id: produtoSelecionado.id,
      }
    )

    if (error) {
      setErro(error.message)
      setRemovendo(false)
      return
    }

    setSucesso(
      `${produtoSelecionado.nome}, lote ${produtoSelecionado.lote}, foi removido com sucesso.`
    )

    setProdutoId('')

    await carregarProdutos()

    setRemovendo(false)
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* CABEÇALHO */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-rose-600 text-white shadow-lg shadow-red-600/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <PackageMinus size={25} />
            </div>

            <div>
              <p className="text-sm font-medium text-red-100">
                SCV Alvorada
              </p>

              <h1 className="text-2xl font-black tracking-tight">
                Retirada de produto
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

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* AVISO */}
        <div className="mb-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <TriangleAlert
            className="mt-0.5 shrink-0 text-amber-600"
            size={22}
          />

          <div>
            <h2 className="font-bold text-amber-900">
              Atenção
            </h2>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              A retirada não apaga o produto do
              histórico. O registro ficará marcado
              como removido no sistema.
            </p>
          </div>
        </div>

        {/* FORMULÁRIO */}
        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 p-6 sm:p-8">
            <h2 className="text-xl font-black text-zinc-900">
              Selecione o produto
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Somente produtos ativos e ainda não
              vencidos podem ser retirados.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {carregando ? (
              <div className="flex min-h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-red-600" />
              </div>
            ) : produtos.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
                <PackageMinus
                  className="mx-auto text-zinc-400"
                  size={35}
                />

                <h3 className="mt-4 font-bold text-zinc-900">
                  Nenhum produto disponível
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Não existem produtos ativos e
                  dentro da validade disponíveis
                  para retirada.
                </p>
              </div>
            ) : (
              <>
                <label className="mb-2 block text-sm font-bold text-zinc-700">
                  Selecione o produto
                </label>

                <select
                  value={produtoId}
                  onChange={(event) => {
                    setProdutoId(
                      event.target.value
                    )
                    setErro('')
                    setSucesso('')
                  }}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-base text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                >
                  {produtos.map((produto) => (
                    <option
                      key={produto.id}
                      value={produto.id}
                    >
                      {produto.nome} — Lote{' '}
                      {produto.lote} — Qtd.{' '}
                      {produto.quantidade}
                    </option>
                  ))}
                </select>

                {produtoSelecionado && (
                  <div className="mt-8 grid gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Produto
                      </p>

                      <p className="mt-2 break-words font-bold text-zinc-900">
                        {
                          produtoSelecionado.nome
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Lote
                      </p>

                      <p className="mt-2 font-mono font-bold text-zinc-900">
                        {
                          produtoSelecionado.lote
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Quantidade
                      </p>

                      <p className="mt-2 font-bold text-zinc-900">
                        {
                          produtoSelecionado.quantidade
                        }
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {erro && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                {sucesso}
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-100 pt-7 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  router.push('/dashboard')
                }
                className="rounded-xl border border-zinc-200 px-6 py-3 font-semibold text-zinc-600 hover:bg-zinc-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={
                  removendo ||
                  carregando ||
                  !produtoSelecionado
                }
                onClick={removerProduto}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-600/20 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {removendo ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Removendo...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Confirmar retirada
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
