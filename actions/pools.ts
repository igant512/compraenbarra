'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function joinOffer(offerId: string, quantity: number = 1) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return { error: 'Debés iniciar sesión para unirte a un grupo.' };
  }

  const { data: existing } = await supabase
    .from('pool_members')
    .select('id')
    .eq('offer_id', offerId)
    .eq('user_id', user.id)
    .single();

  if (existing) return { error: 'Ya te uniste a esta oferta.' };

  const { error: insertError } = await supabase
    .from('pool_members')
    .insert({ offer_id: offerId, user_id: user.id, quantity });

  if (insertError) return { error: insertError.message };

  const { error: updateError } = await supabase.rpc('increment_quantity', {
    p_offer_id: offerId,
    p_amount: quantity
  });

  if (updateError) return { error: 'Error al actualizar la oferta.' };

  revalidatePath('/');
  return { success: true };
}
