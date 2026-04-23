import { createClient } from '@/lib/supabase/server';
import OfferCard from '@/components/OfferCard';

export default async function HomePage() {
  const supabase = createClient();

  // Consulta abierta: trae cualquier oferta draft o active
  const { data: offers, error } = await supabase
    .from('offers')
    .select('*, stores(name, city)')
    .in('status', ['draft', 'active'])
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!offers?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <div className="bg-slate-100 p-4 rounded-full mb-4">🛒</div>
        <h2 className="text-lg font-semibold text-slate-900">No hay ofertas activas</h2>
        <p className="text-sm text-slate-500 mt-2">Vuelve más tarde o crea un grupo nuevo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-slate-900">Ofertas Disponibles</h1>
      <div className="space-y-4">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
