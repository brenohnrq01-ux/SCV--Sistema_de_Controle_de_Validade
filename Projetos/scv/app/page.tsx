'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] =
    useState(false)

  async function fazerLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setErro('')
    setCarregando(true)

    const supabase = createClient()

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      })

    if (error) {
      console.error(
        'Erro Supabase Auth:',
        error
      )

      setErro(
        `Erro no login: ${error.message}`
      )

      setCarregando(false)
      return
    }

    if (!data.user) {
      setErro(
        'Não foi possível identificar o usuário autenticado.'
      )

      setCarregando(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">
      {/* EFEITOS DE FUNDO */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/30 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-700/30 blur-3xl" />

      {/* CARD PRINCIPAL */}
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-2">
        {/* LADO ESQUERDO */}
        <div className="hidden bg-gradient-to-br from-red-700 via-red-600 to-rose-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <ShieldCheck size={30} />
            </div>

            <h1 className="text-5xl font-black tracking-tight">
              SCV Alvorada
            </h1>

            <p className="mt-3 text-xl font-medium text-red-100">
              Sistema de Controle de Validade
            </p>

            <p className="mt-8 max-w-sm leading-7 text-red-100/80">
              Gerencie produtos, validade,
              notificações e perdas de forma
              simples e segura.
            </p>
          </div>

          <p className="text-sm text-red-100/70">
            Controle inteligente de estoque
          </p>
        </div>

        {/* LADO DIREITO */}
        <div className="p-8 sm:p-12">
          {/* LOGO MOBILE */}
          <div className="mb-10 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white">
              <ShieldCheck />
            </div>

            <h1 className="text-3xl font-black text-zinc-900">
              SCV Alvorada
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-zinc-900">
            Bem-vindo
          </h2>

          <p className="mt-2 text-zinc-500">
            Entre com suas credenciais para
            continuar.
          </p>

          <form
            onSubmit={fazerLogin}
            className="mt-8 space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value
                    )

                    setErro('')
                  }}
                  placeholder="usuario@Alvorada.com"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                />
              </div>
            </div>

            {/* SENHA */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Senha
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(event) => {
                    setSenha(
                      event.target.value
                    )

                    setErro('')
                  }}
                  placeholder="Digite sua senha"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                />
              </div>
            </div>

            {/* ERRO */}
            {erro && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {erro}
              </div>
            )}

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {carregando ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Entrando...
                </>
              ) : (
                <>
                  <LogIn size={19} />
                  Entrar no sistema
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, LogIn, Mail, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function fazerLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErro('')
    setCarregando(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('E-mail ou senha inválidos.')
      setCarregando(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-700/30 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-red-700 via-red-600 to-rose-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <ShieldCheck size={30} />
            </div>

            <h1 className="text-5xl font-black tracking-tight">
              SCV
            </h1>

            <p className="mt-3 text-xl font-medium text-red-100">
              Sistema de Controle de Validade
            </p>

            <p className="mt-8 max-w-sm leading-7 text-red-100/80">
              Gerencie produtos, validade, notificações e perdas
              de forma simples e segura.
            </p>
          </div>

          <p className="text-sm text-red-100/70">
            Controle inteligente de estoque
          </p>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mb-10 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white">
              <ShieldCheck />
            </div>

            <h1 className="text-3xl font-black text-zinc-900">
              SCV
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-zinc-900">
            Bem-vindo
          </h2>

          <p className="mt-2 text-zinc-500">
            Entre com suas credenciais para continuar.
          </p>

          <form
            onSubmit={fazerLogin}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="usuario@Alvorada.com"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Senha
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(event) =>
                    setSenha(event.target.value)
                  }
                  placeholder="Digite sua senha"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-4 text-zinc-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                />
              </div>
            </div>

            {erro && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/30 disabled:opacity-60"
            >
              <LogIn size={19} />

              {carregando
                ? 'Entrando...'
                : 'Entrar no sistema'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
