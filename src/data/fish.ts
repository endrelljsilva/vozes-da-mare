import type { Fish } from '../types/fish'

// Espécies comuns da região costeira/estuarina de Pernambuco.
// Textos curtos baseados em conhecimento público; revisar com a equipe e fontes locais.
// [PRECISA SER VERIFICADO]
export const localFish: Fish[] = [
  {
    id: 'carapicu',
    name: 'Carapicu',
    scientificName: 'Diapterus olisthostomus',
    description: 'Peixe prateado comum em áreas costeiras e estuarinas.',
    habitat: 'Estuários e manguezais',
    fishingInfo: 'Pesca artesanal, comum em redes de espera.',
  },
  {
    id: 'tainha',
    name: 'Tainha',
    scientificName: 'Mugil spp.',
    description: 'Peixe de cardume que entra em estuários na maré.',
    habitat: 'Manguezais e canais',
    fishingInfo: 'Pesca artesanal com tarrafa e rede.',
  },
  {
    id: 'camurim',
    name: 'Camurim',
    scientificName: 'Megalops atlanticus',
    description: 'Peixe-espada de grande porte, também chamado de carapeba.',
    habitat: 'Estuários e águas rasas costeiras',
    fishingInfo: 'Pesca esportiva e artesanal, técnicas com linha e anzol.',
  },
  {
    id: 'barracuda',
    name: 'Barracuda',
    scientificName: 'Sphyraena barracuda',
    description: 'Peixe alongado de águas claras, predador rápido.',
    habitat: 'Águas costeiras e estuários',
    fishingInfo: 'Capturado com linha, anzol e isca artificial.',
  },
  {
    id: 'robalo',
    name: 'Robalo',
    scientificName: 'Centropomus undecimalis',
    description: 'Peixe valorizado, vive entre mar e estuários.',
    habitat: 'Estuários e lagunas costeiras',
    fishingInfo: 'Pesca artesanal com rede de espera e linha.',
  },
]
