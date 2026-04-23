'use client';
import { useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { joinOffer } from '@/actions/pools';

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    price_per_unit: number;
    unit: string;
    current_quantity: number;
    min_quantity: number;
    status: string;
    stores: { name: string; city: string } | null; // ← Puede ser null
  };
}

export default function OfferCard({ offer }: OfferCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const percent = Math.min((offer.current_quantity / offer.min_quantity) * 100, 100);
  const isComplete = percent >= 100;

  // ← FIX: Manejo seguro de stores null
  const storeName = offer.stores?.name || 'Comercio';
  const city = offer.stores?.city || 'Uruguay';

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      await joinOffer(offer.id, 1);
    } catch (err: any) {
      setError(err.message || 'No se pudo unir al grupo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-slate-900 leading-tight">{offer.title}</h3>
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
          ${offer.price_per_unit}/{offer.unit}
        </span>
      </div>
      
      <p className="text-slate-500 text-sm line-clamp-2">{offer.description}</p>
      
      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
        <MapPin size={14} />
        <span>{storeName} • {city}</span> {/* ← Usa las variables seguras */}
      </div>

      <div className="space-y-1">
        <ProgressBar value={offer.current_quantity} max={offer.min_quantity} />
        <div className="flex justify-between text-xs text-slate-500">
          <span>{offer.current_quantity} / {offer.min_quantity} {offer.unit}</span>
          <span className="font-medium">{percent.toFixed(0)}%</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-red-500 text-xs bg-red-50 p-2 rounded-lg">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <button
        onClick={handleJoin}
        disabled={loading || isComplete}
        className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2
          ${isComplete 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'}
          ${loading ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        {loading ? (
          <span className="animate-pulse">Uniéndose...</span>
        ) : isComplete ? (
          <>✅ Grupo Activo - Ver contacto</>
        ) : (
          <>🤝 Unirme al grupo</>
        )}
      </button>
    </div>
  );
}
