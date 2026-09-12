'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Hash,
  PackagePlus,
  Save,
  ShoppingBasket,
  Warehouse,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

export default function FormularioProduto() {
  const router = useRouter()

  const [lote, setLote] = useState('')
  const [nome, setNome] = useState('')
  const [valorUnitario, setValorUnitario] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [dataValidade, setDataValidade] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function cadastrarProduto(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setErro('')
    setSucesso('')
    setCarregando(true)

    const supabase = createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setErro(
        'Sua sessão expirou. Faça login novamente.'
      )
      setCarregando(false)
      return
    }

    if (
      new Date(dataValidade) <
      new Date(dataEntrega)
    ) {
      setErro(
        'A data de validade não pode ser anterior à data de entrega.'
      )
      setCarregando(false)
      return
    }

    const { error } = await supabase
      .from('produtos')
      .insert({
        lote: lote.trim(),
        nome: nome.trim(),
        valor_unitario: Number(valorUnitario),
        quantidade: Number(quantidade),
        estado: 'ATIVO',
        data_de_entrega: dataEntrega,
        data_de_validade: dataValidade,
        usuario_cadastro: user.id,
      })

    if (error) {
      console.error(error)

      if (error.code === '23505') {
        setErro(
          'Já existe um produto cadastrado com esse lote.'
        )
      } else if (error.code === '42501') {
        setErro(
          'Você não possui permissão para cadastrar produtos.'
        )
      } else {
        setErro(
          `Erro ao cadastrar produto: ${error.message}`
        )
      }

      setCarregando(false)
      return
    }

    setSucesso(
      'Produto cadastrado com sucesso.'
    )

    setLote('')
    setNome('')
    setValorUnitario('')
    setQuantidade('')
    setDataEntrega('')
    setDataValidade('')

    setCarregando(false)

    router.refresh()
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-rose-600 shadow-lg">
        <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <PackagePlus size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                Cadastrar Produto
              </h1>

              <p className="text-sm text-red-100">
                Adicione um novo lote ao estoque
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
            Novo produto
          </h2>

          <p className="mt-2 text-zinc-500">
            Preencha as informações do produto e do lote.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Warehouse size={22} />
              </div>

              <div>
                <h3 className="font-bold text-zinc-900">
                  Dados do produto
                </h3>

                <p className="text-sm text-zinc-500">
                  Todos os campos são obrigatórios.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={cadastrarProduto}
            className="space-y-6 p-6 sm:p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="lote"
                  className="mb-2 block text-sm font-semibold text-zinc-700"
                >
                  Lote
                </label>

                <div className="relative">
                  <Hash
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="lote"
                    type="text"
                    required
                    value={lote}
                    onChange={(event) =>
                      setLote(event.target.value)
                    }
                    placeholder="Ex.: LOTE-001"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-semibold text-zinc-700"
                >
                  Nome do produto
                </label>

                <div className="relative">
                  <ShoppingBasket
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="nome"
                    type="text"
                    required
                    value={nome}
                    onChange={(event) =>
                      setNome(event.target.value)
                    }
                    placeholder="Ex.: Arroz 5kg"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="valor"
                  className="mb-2 block text-sm font-semibold text-zinc-700"
                >
                  Valor unitário
                </label>

                <div className="relative">
                  <CircleDollarSign
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="valor"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={valorUnitario}
                    onChange={(event) =>
                      setValorUnitario(
                        event.target.value
                      )
                    }
                    placeholder="0,00"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="quantidade"
                  className="mb-2 block text-sm font-semibold text-zinc-700"
                >
                  Quantidade
                </label>

                <div className="relative">
                  <Warehouse
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="quantidade"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={quantidade}
                    onChange={(event) =>
                      setQuantidade(
                        event.target.value
                      )
                    }
                    placeholder="1"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="entrega"
                  className="mb-2 block text-sm font-semibold text-zinc-700"
                >
                  Data de entrega
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="entrega"
                    type="date"
                    required
                    value={dataEntrega}
                    onChange={(event) =>
                      setDataEntrega(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="validade"
                  className="mb-2 block text-sm font-semibold text-zinc-700"
                >
                  Data de validade
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="validade"
                    type="date"
                    required
                    value={dataValidade}
                    onChange={(event) =>
                      setDataValidade(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>
            </div>

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
                disabled={carregando}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {carregando
                  ? 'Cadastrando...'
                  : 'Cadastrar produto'}
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
