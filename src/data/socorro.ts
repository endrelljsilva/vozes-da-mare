export interface GuiaSocorro {
  id: string
  titulo: string
  icone: string
  urgencia: 'urgente' | 'atencao' | 'cuidado'
  oQueFazer: string
  oQueNaoFazer: string
  falaAudio: string
}

export const GUIAS_SOCORRO: GuiaSocorro[] = [
  {
    id: 'arraia-bagre',
    titulo: 'Ferrão de Arraia ou Bagre',
    icone: '⚠️',
    urgencia: 'urgente',
    oQueFazer: 'Mergulhe o local em ÁGUA MORNA (o mais quente que suportar sem queimar). O calor neutraliza o veneno e alivia a dor na hora. Depois vá ao posto.',
    oQueNaoFazer: 'NUNCA coloque urina, borra de café, querosene nem terra. Isso causa infecção grave.',
    falaAudio: 'Se pisou em arraia ou se furou com bagre: coloque o pé imediatamente em água morna ou quente, o máximo que aguentar sem queimar a pele. O calor da água quebra o veneno e tira a dor forte. Nunca bote urina nem borra de café. Depois vá ao posto de saúde.',
  },
  {
    id: 'corte-ostra',
    titulo: 'Corte Fundo com Casca de Ostra',
    icone: '🩸',
    urgencia: 'atencao',
    oQueFazer: 'Lave bastante com água limpa e sabão para tirar a lama. Estanque o sangue com pano limpo e vá ao posto tomar vacina antitetânica.',
    oQueNaoFazer: 'Não passe pós nem feche o corte sujo de lama do mangue. As bactérias da ostra são perigosas.',
    falaAudio: 'Corte com casca de ostra é perigoso porque a lama do mangue tem bactérias. Lave bastante com água limpa e sabão para tirar toda a lama. Se estiver sangrando, aperte com pano limpo e vá ao posto para checar sua vacina do tétano.',
  },
  {
    id: 'sol-calor',
    titulo: 'Fraqueza e Insolação pelo Sol',
    icone: '☀️',
    urgencia: 'cuidado',
    oQueFazer: 'Vá imediatamente para a sombra. Molhe a cabeça, descanse sentada e beba bastante água fresca em pequenos goles.',
    oQueNaoFazer: 'Não continue trabalhando com tontura ou dor de cabeça no sol quente.',
    falaAudio: 'Se sentir tontura, dor de cabeça ou fraqueza na quentura do sol: pare tudo e vá pra sombra de uma árvore. Molhe o rosto e a cabeça com água e beba água devagarzinho. Descanse um pouco antes de voltar.',
  },
  {
    id: 'coluna-lombar',
    titulo: 'Dor nas Costas de Catar Marisco',
    icone: '🧘‍♀️',
    urgencia: 'cuidado',
    oQueFazer: 'A cada meia hora na lama, fique em pé, estique os braços para cima e alongue as costas. Use banquinho ou lata para sentar se puder.',
    oQueNaoFazer: 'Não fique horas curvada sem mudar de posição.',
    falaAudio: 'Cuidar da coluna: catar marisco curvada na lama machuca as costas. A cada meia hora, fique em pé, estique o corpo e respire fundo. Quando puder, use um banquinho ou lata para não forçar tanto a lombar.',
  },
]

export const TELEFONES_EMERGENCIA = [
  {
    nome: 'SAMU (Ambulância)',
    numero: '192',
    link: 'tel:192',
    icone: '🚑',
    descricao: 'Para urgências graves e desmaios',
  },
  {
    nome: 'Bombeiros (Resgate na Água)',
    numero: '193',
    link: 'tel:193',
    icone: '🛟',
    descricao: 'Afogamento ou pessoa perdida no canal',
  },
  {
    nome: 'Hospital Municipal de Itapissuma',
    numero: '(81) 3548-1156',
    link: 'tel:8135481156',
    icone: '🏥',
    descricao: 'Atendimento médico e emergência local',
  },
]
