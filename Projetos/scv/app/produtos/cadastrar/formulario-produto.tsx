'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

  async function cadastrarProduto(event: FormEvent<HTMLFormElement>) {
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
      setErro('Sua sessão expirou. Faça login novamente.')
      setCarregando(false)
      return
    }

    if (new Date(dataValidade) < new Date(dataEntrega)) {
      setErro('A data de validade não pode ser anterior à data de entrega.')
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
        setErro('Já existe um produto cadastrado com esse lote.')
      } else if (error.code === '42501') {
        setErro('Você não possui permissão para cadastrar produtos.')
      } else {
        setErro(`Erro ao cadastrar produto: ${error.message}`)
      }

      setCarregando(false)
      return
    }

    setSucesso('Produto cadastrado com sucesso.')

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
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 shadow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Cadastrar Produto
            </h1>

            <p className="text-sm text-blue-100">
              Sistema de Controle de Validade
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg bg-white px-4 py-2 font-medium text-blue-700 transition hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl bg-white p-8 shadow">
          <form onSubmit={cadastrarProduto} className="space-y-6">
            <div>
              <label
                htmlFor="lote"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Lote
              </label>

              <input
                id="lote"
                type="text"
                value={lote}
                onChange={(event) => setLote(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                placeholder="Ex.: LOTE-001"
              />
            </div>

            <div>
              <label
                htmlFor="nome"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nome do produto
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                placeholder="Ex.: Leite Integral"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="valor"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Valor unitário
                </label>

                <input
                  id="valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorUnitario}
                  onChange={(event) => setValorUnitario(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label
                  htmlFor="quantidade"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Quantidade
                </label>

                <input
                  id="quantidade"
                  type="number"
                  min="1"
                  step="1"
                  value={quantidade}
                  onChange={(event) => setQuantidade(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="entrega"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Data de entrega
                </label>

                <input
                  id="entrega"
                  type="date"
                  value={dataEntrega}
                  onChange={(event) => setDataEntrega(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="validade"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Data de validade
                </label>

                <input
                  id="validade"
                  type="date"
                  value={dataValidade}
                  onChange={(event) => setDataValidade(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
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
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar Produto'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
