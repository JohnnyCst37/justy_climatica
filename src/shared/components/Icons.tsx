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
  Flower2,
  Sprout,
  Sparkles,
} from 'lucide-react';

export const BioPatrimonioLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <img
    src="/logo-jc.png"
    alt="Jornada da Justiça Climática · EE CM João Ribeiro Vilela"
    className={`rounded-xl object-cover border border-emerald-700/30 shadow-2xs shrink-0 ${className}`}
  />
);

export const GrupoIcon: React.FC<{ grupoId: string; className?: string }> = ({
  grupoId,
  className = 'w-4 h-4',
}) => {
  switch (grupoId) {
    case 'grupo1':
      return <Leaf className={className} />;
    case 'grupo2':
      return <Users className={className} />;
    case 'grupo3':
      return <Flower2 className={className} />;
    default:
      return <Sprout className={className} />;
  }
};

export const MetricaIcon: React.FC<{ tipo: string; className?: string }> = ({
  tipo,
  className = 'w-4 h-4',
}) => {
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
