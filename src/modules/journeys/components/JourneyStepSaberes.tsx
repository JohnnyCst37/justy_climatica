import React from 'react';
import { BookOpen, Quote } from 'lucide-react';
import type { CommunityNode, SchoolWork, UserProfile } from '../../../shared/types/domain';
import { SchoolWorksGallery } from '../../submissions/components/SchoolWorksGallery';
import { SubmitWorkForm } from '../../submissions/components/SubmitWorkForm';

interface JourneyStepSaberesProps {
  community: CommunityNode;
  stepIndex: number;
  works: SchoolWork[];
  user: UserProfile | null;
  onRequestLogin: () => void;
  onApproveWork: (workId: string) => void;
  onSubmitWork: (input: {
    schoolName: string;
    classGroup: string;
    title: string;
    workType: SchoolWork['workType'];
    description: string;
    videoUrl?: string;
    videoFile?: File;
    imageFileBase64?: string;
    imageMimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
    onUploadProgress?: (pct: number) => void;
  }) => Promise<unknown>;
}

export const JourneyStepSaberes: React.FC<JourneyStepSaberesProps> = ({
  community,
  stepIndex,
  works,
  user,
  onRequestLogin,
  onApproveWork,
  onSubmitWork,
}) => {
  if (stepIndex === 0) {
    return (
      <div className="space-y-3">
        <div className="bg-violet-50/70 border border-violet-200 rounded-xl p-3.5 space-y-1.5">
          <div className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
            <BookOpen size={14} className="text-violet-700" />
            Saberes Ancestrais & Patrimônio Imaterial
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {community.resumoCientifico.introducao}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
            <Quote size={12} className="text-amber-600" />
            Voz do Território ({community.diarioDeBordo.dataRegistro})
          </div>
          <blockquote className="text-xs text-slate-800 italic leading-relaxed">
            {community.diarioDeBordo.depoimentoOuVoz}
          </blockquote>
          <p className="text-[11px] font-semibold text-slate-600">
            — {community.diarioDeBordo.autorVoz} · {community.diarioDeBordo.cargoOuFuncao}
          </p>
        </div>
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <SchoolWorksGallery
        communityTitle={community.titulo}
        works={works}
        isProfessor={user?.role === 'professor'}
        onApprove={onApproveWork}
      />
    );
  }

  return (
    <SubmitWorkForm
      isLoggedIn={Boolean(user)}
      onRequestLogin={onRequestLogin}
      onSubmitWork={onSubmitWork}
    />
  );
};
