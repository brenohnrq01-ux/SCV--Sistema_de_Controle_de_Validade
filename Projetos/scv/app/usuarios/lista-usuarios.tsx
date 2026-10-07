'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  Crown,
  Shield,
  UserCog,
  Users,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

type Usuario = {
  id: string
  nome: string
  permissao: string
}

type Props = {
  usuarios: Usuario[]
  usuarioAtualId: string
}

const permissoes = [
  'admin',
  'dono',
  'gerente',
  'estoquista',
  'operador',
  'funcionario',
]

function estiloPermissao(permissao: string) {
  switch (permissao) {
    case 'admin':
      return {
        classe:
          'bg-red-100 text-red-700 border-red-200',
        Icone: Crown,
      }

    case 'dono':
      return {
      classe:
        'bg-amber-100 text-amber-700 border-amber-200',
      Icone: Crown,
      }
      
    case 'gerente':
      return {
        classe:
          'bg-purple-100 text-purple-700 border-purple-200',
        Icone: Shield,
      }

    case 'estoquista':
      return {
        classe:
          'bg-blue-100 text-blue-700 border-blue-200',
        Icone: UserCog,
      }

    case 'operador':
      return {
        classe:
          'bg-amber-100 text-amber-700 border-amber-200',
        Icone: UserCog,
      }

    default:
      return {
        classe:
          'bg-zinc-100 text-zinc-600 border-zinc-200',
        Icone: Users,
      }
  }
}

export default function ListaUsuarios({
  usuarios: usuariosIniciais,
  usuarioAtualId,
}: Props) {
  const [usuarios, setUsuarios] =
    useState<Usuario[]>(usuariosIniciais)

  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const [salvandoId, setSalvandoId] =
    useState<string | null>(null)

  async function alterarPermissao(
    id: string,
    novaPermissao: string
  ) {
    setMensagem('')
    setErro('')

    const usuario = usuarios.find(
      (item) => item.id === id
    )

    if (!usuario) {
      setErro('Usuário não encontrado.')
      return
    }

    if (usuario.permissao === novaPermissao) {
      return
    }

    if (id === usuarioAtualId) {
      const confirmar = window.confirm(
        'Você está alterando a permissão da sua própria conta. Deseja continuar?'
      )

      if (!confirmar) {
        return
      }
    }

    setSalvandoId(id)

    const supabase = createClient()

    const { error } = await supabase
      .from('usuario')
      .update({
        permissao: novaPermissao,
      })
      .eq('id', id)

    if (error) {
      setErro(
        `Erro ao alterar permissão: ${error.message}`
      )
      setSalvandoId(null)
      return
    }

    setUsuarios((anteriores) =>
      anteriores.map((item) =>
        item.id === id
          ? {
              ...item,
              permissao: novaPermissao,
            }
          : item
      )
    )

    setMensagem(
      `Permissão de ${usuario.nome} alterada com sucesso.`
    )

    setSalvandoId(null)
  }

  return (
    <>
      {/* RESUMO */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Users size={22} />
          </div>

          <p className="mt-5 text-sm font-medium text-zinc-500">
            Usuários cadastrados
          </p>

          <p className="mt-1 text-4xl font-black text-zinc-900">
            {usuarios.length}
          </p>
        </div>

        <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-600 to-rose-600 p-6 text-white shadow-lg shadow-red-600/15">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
            <Shield size={22} />
          </div>

          <p className="mt-5 text-sm font-medium text-red-100">
            Administração
          </p>

          <p className="mt-1 text-xl font-black">
            Controle de permissões
          </p>
        </div>
      </div>

      {/* MENSAGENS */}
      {mensagem && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          <CheckCircle2 size={20} />
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {erro}
        </div>
      )}

      {/* CELULAR */}
      <div className="space-y-4 md:hidden">
        {usuarios.map((usuario) => {
          const estilo = estiloPermissao(
            usuario.permissao
          )

          const Icone = estilo.Icone

          return (
            <article
              key={usuario.id}
              className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-lg font-black text-red-600">
                  {usuario.nome
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words text-lg font-bold text-zinc-900">
                      {usuario.nome}
                    </h3>

                    {usuario.id ===
                      usuarioAtualId && (
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                        Você
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${estilo.classe}`}
                    >
                      <Icone size={14} />

                      {usuario.permissao}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-100 bg-zinc-50 p-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Alterar permissão
                </label>

                <div className="flex items-center gap-3">
                  <select
                    value={usuario.permissao}
                    disabled={
                      salvandoId === usuario.id
                    }
                    onChange={(event) =>
                      alterarPermissao(
                        usuario.id,
                        event.target.value
                      )
                    }
                    className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base font-medium text-zinc-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:opacity-50"
                  >
                    {permissoes.map(
                      (permissao) => (
                        <option
                          key={permissao}
                          value={permissao}
                        >
                          {permissao}
                        </option>
                      )
                    )}
                  </select>

                  {salvandoId === usuario.id && (
                    <div className="h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-red-600" />
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* TABLET / COMPUTADOR */}
      <div className="hidden overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm md:block">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h3 className="font-bold text-zinc-900">
            Usuários do sistema
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Altere apenas quando necessário.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="bg-zinc-50 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                <th className="px-6 py-4">
                  Usuário
                </th>

                <th className="px-6 py-4">
                  Permissão atual
                </th>

                <th className="px-6 py-4">
                  Alterar permissão
                </th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => {
                const estilo =
                  estiloPermissao(
                    usuario.permissao
                  )

                const Icone =
                  estilo.Icone

                return (
                  <tr
                    key={usuario.id}
                    className="border-t border-zinc-100 transition hover:bg-zinc-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600">
                          {usuario.nome
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-zinc-900">
                            {usuario.nome}
                          </p>

                          {usuario.id ===
                            usuarioAtualId && (
                            <span className="mt-1 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                              Você
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${estilo.classe}`}
                      >
                        <Icone size={14} />
                        {usuario.permissao}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <select
                          value={
                            usuario.permissao
                          }
                          disabled={
                            salvandoId ===
                            usuario.id
                          }
                          onChange={(event) =>
                            alterarPermissao(
                              usuario.id,
                              event.target.value
                            )
                          }
                          className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 disabled:opacity-50"
                        >
                          {permissoes.map(
                            (permissao) => (
                              <option
                                key={permissao}
                                value={permissao}
                              >
                                {permissao}
                              </option>
                            )
                          )}
                        </select>

                        {salvandoId ===
                          usuario.id && (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-red-600" />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AVISO */}
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
        Evite alterar a permissão da única conta
        administrativa disponível. Sem um administrador,
        o gerenciamento de usuários e os relatórios
        administrativos ficarão inacessíveis.
      </div>
    </>
  )
}
