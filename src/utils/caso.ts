import type { CasoData } from '../components/CaseCard';
import type { Caso, Vitima, Evidencia, Perito } from '../types/caso';
import { convertStatusToFrontend } from '../components/CaseCard';

export function convertCasoDataToCaso(
  casoData: CasoData,
  vitimas: Vitima[],
  evidencias: Evidencia[],
  peritos: Perito[]
): Caso {
  return {
    _id: casoData._id,
    titulo: casoData.titulo,
    descricao: casoData.descricao,
    responsavel: casoData.responsavel,
    status: convertStatusToFrontend(casoData.status),
    dataAbertura: casoData.dataAbertura,
    sexo: casoData.sexo.toLowerCase() as 'masculino' | 'feminino' | 'outro',
    local: casoData.local,
    vitimas,
    evidencias,
    peritos,
  };
} 