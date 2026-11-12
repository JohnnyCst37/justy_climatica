import React from 'react';
import { 
  TreePine, 
  Droplet, 
  Users, 
  AlertTriangle, 
  Dna, 
  Scroll, 
  Flame, 
  Leaf, 
  Heart,
  Flower2,
  Compass,
  Sprout,
  ShieldCheck,
  Building2,
  Sparkles,
  Fish,
  Bird,
  BookOpen
} from 'lucide-react';

export const BioPatrimonioLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={`fill-none stroke-current ${className}`}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Stylized Mato Grosso Nature Badge: Sun, Plant Leaf & River Wave */}
    <circle cx="24" cy="24" r="21" className="fill-emerald-800/10 stroke-emerald-800" strokeWidth="2.5" />
    {/* Sun in the Cerrado sky */}
    <circle cx="16" cy="15" r="4" className="fill-amber-400 stroke-amber-500" />
    {/* Pantanal Water Wave */}
    <path d="M7 32 C14 27, 20 37, 28 32 C34 28, 38 33, 41 31" className="stroke-sky-600" strokeWidth="2.5" />
    <path d="M9 37 C15 33, 21 41, 29 37 C35 34, 38 38, 41 36" className="stroke-teal-600" strokeWidth="1.8" />
    {/* Cerrado Sprout / Buriti Palm Leaf */}
    <path d="M24 33 V18" className="stroke-emerald-800" strokeWidth="2.5" />
    <path d="M24 23 C18 20, 16 14, 24 12 C32 14, 30 20, 24 23 Z" className="fill-emerald-600 stroke-emerald-800" />
    <path d="M24 27 C19 25, 20 20, 24 21" className="stroke-emerald-700" />
    <path d="M24 27 C29 25, 28 20, 24 21" className="stroke-emerald-700" />
  </svg>
);

export const GrupoIcon: React.FC<{ grupoId: 'grupo1' | 'grupo2' | 'grupo3'; className?: string }> = ({ grupoId, className = "w-4 h-4" }) => {
  switch (grupoId) {
    case 'grupo1':
      // Biodiversidade & Genética
      return <Leaf className={className} />;
    case 'grupo2':
      // Comunidades & Impactos
      return <Users className={className} />;
    case 'grupo3':
      // Patrimônio Imaterial
      return <Flower2 className={className} />;
    default:
      return <Sprout className={className} />;
  }
};

export const MetricaIcon: React.FC<{ tipo: string; className?: string }> = ({ tipo, className = "w-4 h-4" }) => {
  switch (tipo) {
    case 'arvore':
      return <TreePine className={className} />;
    case 'agua':
      return <Droplet className={className} />;
    case 'comunidade':
      return <Users className={className} />;
    case 'alerta':
      return <AlertTriangle className={className} />;
    case 'dna':
      return <Dna className={className} />;
    case 'patrimonio':
      return <Scroll className={className} />;
    case 'fogo':
      return <Flame className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
