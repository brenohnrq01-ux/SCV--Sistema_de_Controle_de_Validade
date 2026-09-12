'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Clock3,
  Info,
  OctagonAlert,
} from 'lucide-react'

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

  const [usuarioId, setUsuarioId] =
    useState('')

  const [carregando, setCarregando] =
    useState(true)

  const [marcandoTodas, setMarcandoTodas] =
    useState(false)

  const [erro, setErro] =
    useState('')

  async function carregarNotificacoes() {
    setCarregando(true)
    setErro('')

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setErro('Sua sessão expirou.')
      setCarregando(false)
      return
    }

    setUsuarioId(user.id)

    const { error: gerarError } =
      await supabase.rpc(
        'gerar_notificacoes_validade'
      )

    if (gerarError) {
      console.error(
        'Erro ao gerar notificações:',
        gerarError
      )
    }

    const { data, error } =
      await supabase
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
      setErro(
        `Erro ao carregar notificações: ${error.message}`
      )
      setCarregando(false)
      return
    }

    setNotificacoes(data ?? [])
    setCarregando(false)
  }

  useEffect(() => {
    carregarNotificacoes()
  }, [])

  async function marcarComoLida(
    id: number
  ) {
    const supabase = createClient()

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

    setNotificacoes(
      (anteriores) =>
        anteriores.map(
          (notificacao) =>
            notificacao.id === id
              ? {
                  ...notificacao,
                  visualizada: true,
                }
              : notificacao
        )
    )
  }

  async function marcarTodasComoLidas() {
    if (!usuarioId) {
      return
    }

    setMarcandoTodas(true)
    setErro('')

    const supabase = createClient()

    const { error } = await supabase
      .from('notificacao')
      .update({
        visualizada: true,
      })
      .eq(
        'usuario_id',
        usuarioId
      )
      .eq(
        'visualizada',
        false
      )

    if (error) {
      setErro(error.message)
      setMarcandoTodas(false)
      return
    }

    setNotificacoes(
      (anteriores) =>
        anteriores.map(
          (notificacao) => ({
            ...notificacao,
            visualizada: true,
          })
        )
    )

    setMarcandoTodas(false)
  }

  function estiloTipo(
    tipo: string
  ) {
    switch (tipo) {
      case 'VENCIDO':
        return {
          titulo: 'Vencido',
          badge:
            'bg-zinc-950 text-white',
          borda:
            'border-zinc-300',
          fundo:
            'bg-zinc-50',
          iconeFundo:
            'bg-zinc-900 text-white',
          Icone: OctagonAlert,
        }

      case 'URGENTE':
        return {
          titulo: 'Urgente',
          badge:
            'bg-red-600 text-white',
          borda:
            'border-red-200',
          fundo:
            'bg-red-50/40',
          iconeFundo:
            'bg-red-100 text-red-600',
          Icone: AlertTriangle,
        }

      case 'ATENCAO':
        return {
          titulo: 'Atenção',
          badge:
            'bg-yellow-400 text-zinc-950',
          borda:
            'border-yellow-200',
          fundo:
            'bg-yellow-50/40',
          iconeFundo:
            'bg-yellow-100 text-yellow-700',
          Icone: Clock3,
        }

      default:
        return {
          titulo: 'Aviso',
          badge:
            'bg-green-600 text-white',
          borda:
            'border-green-200',
          fundo:
            'bg-green-50/40',
          iconeFundo:
            'bg-green-100 text-green-700',
          Icone: Info,
        }
    }
  }

  const naoLidas =
    notificacoes.filter(
      (notificacao) =>
        !notificacao.visualizada
    ).length

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-rose-600 shadow-lg">
        <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <BellRing size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                Notificações
              </h1>

              <p className="text-sm text-red-100">
                Alertas de validade dos produtos
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

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Central de alertas
            </p>

            <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
              Acompanhe seus avisos
            </h2>

            <p className="mt-2 text-zinc-500">
              Fique atento aos produtos próximos do vencimento.
            </p>
          </div>

          {naoLidas > 0 && (
            <button
              type="button"
              onClick={
                marcarTodasComoLidas
              }
              disabled={
                marcandoTodas
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
            >
              <CheckCheck size={18} />

              {marcandoTodas
                ? 'Marcando...'
                : 'Marcar todas como lidas'}
            </button>
          )}
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <BellRing size={22} />
            </div>

            <p className="mt-5 text-sm font-medium text-zinc-500">
              Não lidas
            </p>

            <p className="mt-1 text-4xl font-black text-red-600">
              {naoLidas}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
              <Bell size={22} />
            </div>

            <p className="mt-5 text-sm font-medium text-zinc-500">
              Total de notificações
            </p>

            <p className="mt-1 text-4xl font-black text-zinc-900">
              {notificacoes.length}
            </p>
          </div>
        </div>

        {erro && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-zinc-200 border-t-red-600" />

            <p className="mt-5 font-medium text-zinc-500">
              Carregando notificações...
            </p>
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <Check size={28} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-zinc-900">
              Tudo certo por aqui
            </h3>

            <p className="mt-2 text-zinc-500">
              Não existem alertas de validade no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificacoes.map(
              (notificacao) => {
                const estilo =
                  estiloTipo(
                    notificacao.tipo
                  )

                const Icone =
                  estilo.Icone

                return (
                  <article
                    key={
                      notificacao.id
                    }
                    className={`rounded-3xl border p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${estilo.borda} ${
                      notificacao.visualizada
                        ? 'bg-white opacity-65'
                        : estilo.fundo
                    }`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${estilo.iconeFundo}`}
                      >
                        <Icone
                          size={23}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${estilo.badge}`}
                          >
                            {
                              estilo.titulo
                            }
                          </span>

                          {!notificacao.visualizada && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                              NOVA
                            </span>
                          )}

                          {notificacao.visualizada && (
                            <span className="flex items-center gap-1 text-xs font-medium text-zinc-400">
                              <Check
                                size={13}
                              />
                              Lida
                            </span>
                          )}
                        </div>

                        <p className="mt-4 font-semibold leading-6 text-zinc-900">
                          {
                            notificacao.mensagem
                          }
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                          <span>
                            Lote:{' '}
                            <strong className="font-semibold text-zinc-700">
                              {
                                notificacao.Produtos_lote
                              }
                            </strong>
                          </span>

                          <span>
                            {new Date(
                              notificacao.data
                            ).toLocaleString(
                              'pt-BR'
                            )}
                          </span>
                        </div>
                      </div>

                      {!notificacao.visualizada && (
                        <button
                          type="button"
                          onClick={() =>
                            marcarComoLida(
                              notificacao.id
                            )
                          }
                          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Check
                            size={16}
                          />
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </article>
                )
              }
            )}
          </div>
        )}

        <footer className="py-10 text-center text-sm text-zinc-400">
          SCV • Sistema de Controle de Validade
        </footer>
      </div>
    </main>
  )
}
