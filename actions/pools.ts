'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function joinOffer(offerId: string, quantity: number = 1) {
  const supabase = createClient();

  // ✅ FIX: Sin desestructuración compleja
  const result = await supabase.auth.getUser();
  
  if (result.error || !result.data?.user) {
    throw new Error('Debes iniciar sesión para unirte.');
  }
  
  const user = result.data.user;

  // Evitar duplicados
  const existing = await supabase
    .from('pool_members')
    .select('id')
    .eq('offer_id', offerId)
    .eq('user_id', user.id)
    .single();

  if (existing.data) {
    throw new Error('Ya te uniste a esta oferta.');
  }

  // Registrar unión
  const insertResult = await supabase
    .from('pool_members')
    .insert({ offer_id: offerId, user_id: user.id, quantity });

  if (insertResult.error) {
    throw new Error('Error al registrar tu unión: ' + insertResult.error.message);
  }

  // Actualizar contador vía RPC
  const rpcResult = await supabase.rpc('increment_quantity', {
    p_offer_id: offerId,
    p_amount: quantity
  });

  if (rpcResult.error) {
    throw new Error('Error al actualizar la oferta.');
  }

  revalidatePath('/');
  return { success: true };
}
