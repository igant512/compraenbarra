import { createClient } from '@/lib/supabase/server';
import OfferCard from '@/components/OfferCard';

export default async function HomePage({ searchParams }: any) {
  const params = await searchParams;
  const city = params?.city || 'Montevideo';
  const supabase = createClient();

  const {  offers } = await supabase
    .from('offers')
    .select('*, stores(name, city)')
    .eq('stores.city', city)
    .in('status', ['draft', 'active'])
    .order('created_at', { ascending: false });

  if (!offers?.length) {
    return <div className="p-6 text-center text-slate-500">No hay ofertas activas en {city}</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Ofertas en {city}</h1>
      <div className="space-y-4">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
