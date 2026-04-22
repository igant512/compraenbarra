import { createClient } from '@/lib/supabase/server';
import OfferCard from '@/components/OfferCard';

export default async function HomePage({ searchParams }: { searchParams: { city?: string } }) {
  const supabase = createClient();
  const cityFilter = searchParams.city || 'Montevideo';

  const { data: offers, error } = await supabase
    .from('offers')
    .select('*, stores(name, city)')
    .eq('stores.city', cityFilter)
    .in('status', ['draft', 'active'])
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <p className="text-red-500 font-medium">Error al cargar las ofertas.</p>
        <p className="text-sm text-slate-400 mt-1">{error.message}</p>
      </div>
    );
  }

  if (!offers?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <span className="text-2xl">🛒</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">No hay ofertas activas</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-xs">
          No encontramos compras grupales en <strong>{cityFilter}</strong>. 
          Intenta cambiar la ciudad o vuelve más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Ofertas en {cityFilter}</h1>
      </header>
      
      <div className="space-y-4">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
