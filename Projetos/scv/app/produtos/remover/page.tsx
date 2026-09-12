import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FormularioRemocao from './formulario-remocao'

export default async function RemoverProdutoPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: usuario, error } = await supabase
    .from('usuario')
    .select('permissao')
    .eq('id', user.id)
    .single()

  if (error || !usuario) {
    redirect('/dashboard')
  }

  const permissoesPermitidas = [
    'admin',
    'gerente',
    'estoquista',
  ]

  if (!permissoesPermitidas.includes(usuario.permissao)) {
    redirect('/dashboard')
  }

  return <FormularioRemocao />
}
