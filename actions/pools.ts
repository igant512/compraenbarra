'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function joinOffer(offerId: string, quantity: number = 1) {
  const supabase = createClient();
  
  // 1. Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) throw new Error('Debes iniciar sesión para unirte.');

  // 2. Evitar duplicados
  const { data: existing } = await supabase
    .from('pool_members')
    .select('id')
    .eq('offer_id', offerId)
    .eq('user_id', user.id)
    .single();

  if (existing) throw new Error('Ya te uniste a esta oferta.');

  // 3. Registrar unión
  const { error: insertError } = await supabase
    .from('pool_members')
    .insert({ offer_id: offerId, user_id: user.id, quantity });

  if (insertError) throw new Error(insertError.message);

  // 4. Incrementar cantidad atómicamente (RPC seguro)
  const { error: updateError } = await supabase.rpc('increment_quantity', {
    p_offer_id: offerId,
    p_amount: quantity
  });

  if (updateError) throw new Error('Error al actualizar la oferta. Intenta de nuevo.');

  revalidatePath('/');
  return { success: true };
}
