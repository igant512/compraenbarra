import { createClient } from '@/lib/supabase/server';
import { Package, Clock, CheckCircle } from 'lucide-react';

export default async function MyPurchasesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <Package className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-semibold text-slate-900">Inicia sesión para ver tus grupos</h2>
        <p className="text-sm text-slate-500 mt-2">Únete a compras grupales y ahorra con tus vecinos.</p>
      </div>
    );
  }

  // Obtener membresías del usuario
  const { data: memberships } = await supabase
    .from('pool_members')
    .select('*, offers(title, price_per_unit, unit, status, min_quantity, current_quantity), stores(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!memberships?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <Clock className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-semibold text-slate-900">Aún no te uniste a ningún grupo</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-xs">
          Explora las ofertas en Inicio y sé el primero en crear un grupo en tu zona.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Mis Grupos</h1>
      
      {memberships.map((m) => {
        const percent = Math.min((m.offers.current_quantity / m.offers.min_quantity) * 100, 100);
        const isComplete = percent >= 100;
        
        return (
          <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-slate-900">{m.offers.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {isComplete ? '✅ Activo' : '⏳ En progreso'}
              </span>
            </div>
            
            <p className="text-sm text-slate-500 mt-1">{m.stores?.name}</p>
            
            <div className="mt-3 space-y-2">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{m.offers.current_quantity}/{m.offers.min_quantity} {m.offers.unit}</span>
                <span>{percent.toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-600">Tu parte: <strong>{m.quantity} {m.offers.unit}</strong></span>
              <span className="font-semibold text-emerald-600">${m.offers.price_per_unit}/{m.offers.unit}</span>
            </div>
            
            {isComplete && (
              <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                📱 Ver contacto del local
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
