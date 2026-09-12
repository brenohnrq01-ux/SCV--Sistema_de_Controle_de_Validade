'use client'

import { useState } from 'react'
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
  'gerente',
  'estoquista',
  'operador',
  'funcionario',
]

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
    setSalvandoId(id)

    const usuario = usuarios.find(
      (item) => item.id === id
    )

    if (!usuario) {
      setErro('Usuário não encontrado.')
      setSalvandoId(null)
      return
    }

    if (id === usuarioAtualId) {
      const confirmar = window.confirm(
        'Você está alterando a permissão da sua própria conta. Deseja continuar?'
      )

      if (!confirmar) {
        setSalvandoId(null)
        return
      }
    }

    const supabase = createClient()

    const { error } = await supabase
      .from('usuario')
      .update({
        permissao: novaPermissao,
      })
      .eq('id', id)

    if (error) {
      setErro(`Erro ao alterar permissão: ${error.message}`)
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
      {mensagem && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {erro}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-4">
                Nome
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
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className="border-t border-gray-200"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {usuario.nome}

                  {usuario.id === usuarioAtualId && (
                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                      Você
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold capitalize text-gray-700">
                    {usuario.permissao}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <select
                    value={usuario.permissao}
                    disabled={salvandoId === usuario.id}
                    onChange={(event) =>
                      alterarPermissao(
                        usuario.id,
                        event.target.value
                      )
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:opacity-60"
                  >
                    {permissoes.map((permissao) => (
                      <option
                        key={permissao}
                        value={permissao}
                      >
                        {permissao}
                      </option>
                    ))}
                  </select>

                  {salvandoId === usuario.id && (
                    <span className="ml-3 text-sm text-gray-500">
                      Salvando...
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
