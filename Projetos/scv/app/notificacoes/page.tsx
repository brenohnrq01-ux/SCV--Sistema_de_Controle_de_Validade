'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Notificacao = {
  id: number
  mensagem: string
  tipo: string
  data: string
  visualizada: boolean
  Produtos_lote: string
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] =
    useState<Notificacao[]>([])

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const supabase = createClient()

  async function carregarNotificacoes() {
   setErro('')
    const {
   	 data: { user },
 	 } = await supabase.auth.getUser()

 	 if (!user) {
  	  setErro('Sua sessão expirou.')
  	  setCarregando(false)
  	  return
 	 }

 	 const { error: gerarError } =
  	  await supabase.rpc(
     	 'gerar_notificacoes_validade'
    	)

  	if (gerarError) {
  	  console.error(gerarError)
 	 }

 	 const { data, error } = await supabase
   	 .from('notificacao')
   	 .select(`
    	  id,
     	 mensagem,
     	 tipo,
     	 data,
     	 visualizada,
     	 Produtos_lote
   	 `)
   	 .eq('usuario_id', user.id)
   	 .order('data', {
    	  ascending: false,
   	 })
	
 	 if (error) {
  	  setErro(error.message)
  	  setCarregando(false)
 	   return
	  }

 	 setNotificacoes(data ?? [])
	  setCarregando(false)
	}
 
  async function marcarComoLida(id: number) {
    const { error } = await supabase
      .from('notificacao')
      .update({
        visualizada: true,
      })
      .eq('id', id)

    if (error) {
      setErro(error.message)
      return
    }

    setNotificacoes((anteriores) =>
      anteriores.map((notificacao) =>
        notificacao.id === id
          ? {
              ...notificacao,
              visualizada: true,
            }
          : notificacao
      )
    )
  }

  function corTipo(tipo: string) {
    switch (tipo) {
      case 'VENCIDO':
        return 'bg-black text-white'

      case 'URGENTE':
        return 'bg-red-600 text-white'

      case 'ATENCAO':
        return 'bg-yellow-400 text-gray-900'

      default:
        return 'bg-green-600 text-white'
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 shadow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Notificações
            </h1>

            <p className="text-sm text-blue-100">
              Alertas de validade dos produtos
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

      <div className="mx-auto max-w-5xl p-6">
        {erro && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            Carregando notificações...
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h2 className="text-xl font-bold text-gray-900">
              Nenhuma notificação
            </h2>

            <p className="mt-2 text-gray-600">
              Não existem alertas de validade no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificacoes.map((notificacao) => (
              <div
                key={notificacao.id}
                className={`rounded-xl bg-white p-6 shadow ${
                  notificacao.visualizada
                    ? 'opacity-60'
                    : ''
                }`}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${corTipo(
                          notificacao.tipo
                        )}`}
                      >
                        {notificacao.tipo}
                      </span>

                      {!notificacao.visualizada && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          NOVA
                        </span>
                      )}
                    </div>

                    <p className="font-medium text-gray-900">
                      {notificacao.mensagem}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Lote: {notificacao.Produtos_lote}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(
                        notificacao.data
                      ).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  {!notificacao.visualizada && (
                    <button
                      onClick={() =>
                        marcarComoLida(
                          notificacao.id
                        )
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Marcar como lida
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
