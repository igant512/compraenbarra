'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Package, Clock } from 'lucide-react';

export default function MyPurchasesPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ FIX: Sintaxis correcta
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        setUser(user);

        const { data, error } = await supabase
          .from('pool_members')
          .select(`*, offers(title, price_per_unit, unit, status, min_quantity, current_quantity), stores(name)`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMemberships(data || []);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-4 text-center text-slate-500">Cargando...</div>;
  if (!user) return (
    <div className="p-4 text-center">
      <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-600">Inicia sesión para ver tus grupos</p>
    </div>
  );
  if (!memberships.length) return (
    <div className="p-4 text-center">
      <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-600">Aún no te uniste a ningún grupo</p>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Mis Grupos</h1>
      {memberships.map((m: any) => {
        const offer = m.offers;
        if (!offer) return null;
        const percent = Math.min((offer.current_quantity / offer.min_quantity) * 100, 100);
        return (
          <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border">
            <div className="flex justify-between">
              <h3 className="font-semibold">{offer.title}</h3>
              <span className="text-emerald-600 text-sm">${offer.price_per_unit}/{offer.unit}</span>
            </div>
            <p className="text-slate-500 text-sm mt-1">{m.stores?.name || 'Comercio'}</p>
            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-1">{offer.current_quantity}/{offer.min_quantity} {offer.unit}</p>
            </div>
            <p className="text-sm mt-2">Tu parte: <strong>{m.quantity} {offer.unit}</strong></p>
          </div>
        );
      })}
    </div>
  );
}
