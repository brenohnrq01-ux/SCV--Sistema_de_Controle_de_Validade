'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
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
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            SCV
          </h1>

          <p className="mt-2 text-gray-600">
            Sistema de Controle de Validade
          </p>
        </div>

        <form onSubmit={fazerLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              placeholder="usuario@Alvorada.com"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Senha
            </label>

            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              placeholder="Digite sua senha"
            />
          </div>

          {erro && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
