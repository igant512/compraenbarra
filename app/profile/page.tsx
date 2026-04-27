import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/actions/auth';
import { User, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-slate-100 rounded-full p-5 mb-4">
          <User className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">No estás logueado</h2>
        <p className="text-slate-500 text-sm mb-5">Iniciá sesión para ver tu perfil</p>
        <Link
          href="/login"
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
        <div className="bg-emerald-100 rounded-full p-3">
          <User className="w-7 h-7 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500">Email</p>
          <p className="font-medium text-slate-900 truncate">{user.email}</p>
        </div>
      </div>

      <form action={signOut}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-medium text-sm hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
