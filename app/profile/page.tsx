import { createClient } from '@/lib/supabase/server';
import { MapPin, Star, LogOut, Settings } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <div className="bg-slate-200 w-20 h-20 rounded-full mb-4" />
        <h2 className="text-lg font-semibold text-slate-900">No has iniciado sesión</h2>
        <p className="text-sm text-slate-500 mt-2">Únete para guardar tus grupos y recibir notificaciones.</p>
        <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700">
          Iniciar sesión
        </button>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, city, rating_avg, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <div className="space-y-6">
      {/* Header de perfil */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
        <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">{profile?.username || 'Usuario'}</h2>
        
        <div className="flex items-center justify-center gap-1 mt-1 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill={i < Math.round(profile?.rating_avg || 5) ? 'currentColor' : 'none'} />
          ))}
          <span className="text-sm text-slate-400 ml-1">({profile?.rating_avg || 5.0})</span>
        </div>
        
        <div className="flex items-center justify-center gap-1 mt-2 text-slate-500 text-sm">
          <MapPin size={14} />
          <span>{profile?.city || 'Sin ciudad'}</span>
        </div>
      </div>

      {/* Menú de opciones */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left">
          <Settings className="w-5 h-5 text-slate-400" />
          <span className="text-slate-700">Configuración de cuenta</span>
        </button>
        <div className="border-t border-slate-100" />
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left">
          <MapPin className="w-5 h-5 text-slate-400" />
          <span className="text-slate-700">Cambiar ciudad</span>
        </button>
        <div className="border-t border-slate-100" />
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left text-red-600">
          <LogOut className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-3">Tu actividad</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-600">0</p>
            <p className="text-xs text-slate-500">Grupos creados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">0</p>
            <p className="text-xs text-slate-500">Uniones</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">$0</p>
            <p className="text-xs text-slate-500">Ahorro estimado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
