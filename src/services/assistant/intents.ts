export type Intent =
  | 'saudacao'
  | 'agradecimento'
  | 'despedida'
  | 'capacidade'
  | 'clima'
  | 'pescar_agora'
  | 'mare'
  | 'peixes'
  | 'saude'
  | 'sintoma'
  | 'unidade'
  | 'risco'
  | 'roupa'
  | 'local'
  | 'desconhecido'

interface Definicao {
  id: Intent
  termos: ReadonlyArray<readonly [string, number]>
}

export const normalizar = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const DEFINICOES: readonly Definicao[] = [
  {
    id: 'saudacao',
    termos: [
      ['oi', 3],
      ['ola', 3],
      ['opa', 2],
      ['e ai', 3],
      ['bom dia', 3],
      ['boa tarde', 3],
      ['boa noite', 2],
      ['tudo bem', 2],
      ['o fia', 3],
      ['dona mare', 3],
    ],
  },
  {
    id: 'agradecimento',
    termos: [
      ['obrigado', 3],
      ['obrigada', 3],
      ['valeu', 3],
      ['agradeco', 3],
      ['muito bom', 2],
      ['muito boa', 2],
      ['deus lhe pague', 3],
    ],
  },
  {
    id: 'despedida',
    termos: [
      ['tchau', 3],
      ['ate mais', 3],
      ['ate logo', 3],
      ['boa noite tchau', 2],
      ['falou', 2],
      ['fui', 2],
    ],
  },
  {
    id: 'capacidade',
    termos: [
      ['o que voce sabe', 3],
      ['o que voce faz', 3],
      ['o que ela sabe', 3],
      ['o que pode fazer', 3],
      ['para que voce serve', 3],
      ['o que tem aqui', 2],
      ['como funciona', 2],
      ['me ajuda', 2],
    ],
  },
  {
    id: 'pescar_agora',
    termos: [
      ['posso pescar', 3],
      ['posso ir pescar', 3],
      ['posso sair', 3],
      ['da pra pescar', 3],
      ['vale a pena pescar', 3],
      ['sair para pescar', 3],
      ['ir para a agua', 3],
      ['posso ir para o mar', 3],
      ['hora de pescar', 3],
      ['posso mariscar', 4],
      ['da pra catar marisco', 4],
      ['da pra ir pro mangue', 4],
      ['ta bom de ir', 3],
      ['agora', 1],
    ],
  },
  {
    id: 'clima',
    termos: [
      ['tempo', 3],
      ['clima', 3],
      ['como esta o dia', 3],
      ['como esta hoje', 2],
      ['previsao', 3],
      ['vai chover', 3],
      ['esta chovendo', 3],
      ['chuva', 2],
      ['chover', 2],
      ['vento', 2],
      ['ventando', 2],
      ['temperatura', 2],
      ['calor', 2],
      ['frio', 2],
      ['umidade', 2],
      ['sol', 1],
      ['horas', 1],
      ['amanha', 1],
      ['noite', 1],
    ],
  },
  {
    id: 'mare',
    termos: [
      ['mare', 3],
      ['mares', 3],
      ['preamar', 3],
      ['vazante', 3],
      ['subindo', 2],
      ['baixando', 2],
      ['secando', 3],
      ['vazando', 3],
      ['enchendo', 3],
      ['altura da agua', 3],
      ['que horas seca', 4],
      ['hora da mare', 4],
    ],
  },
  {
    id: 'peixes',
    termos: [
      ['peixe', 3],
      ['peixes', 3],
      ['qual peixe', 3],
      ['especie', 2],
      ['carapicu', 3],
      ['tainha', 3],
      ['robalo', 3],
      ['pomba', 3],
      ['camurim', 3],
      ['sardinha', 2],
      ['sururu', 4],
      ['marisco', 4],
      ['ostra', 4],
      ['caranguejo', 4],
      ['aratu', 4],
      ['siri', 4],
    ],
  },
  {
    id: 'unidade',
    termos: [
      ['posto', 3],
      ['posto de saude', 3],
      ['unidade', 3],
      ['hospital', 3],
      ['ubs', 3],
      ['usf', 3],
      ['como chegar', 3],
      ['onde fica', 2],
      ['medico', 2],
      ['enfermeira', 2],
      ['atendimento', 2],
      ['remedio', 2],
      ['samu', 4],
      ['ambulancia', 4],
    ],
  },
  {
    id: 'sintoma',
    termos: [
      ['dor', 3],
      ['dor de cabeca', 3],
      ['coceira', 3],
      ['com o que', 2],
      ['me sinto', 3],
      ['coringa', 3],
      ['sangramento', 3],
      ['corrimento', 3],
      ['ferida', 3],
      ['febre', 3],
      ['infeccao', 3],
      ['irritacao', 3],
      ['inchaco', 3],
      ['menstruacao', 2],
      ['menstruando', 2],
      ['sintoma', 2],
      ['mal', 1],
      ['arraia', 4],
      ['bagre', 4],
      ['cortei', 3],
      ['dor nas costas', 4],
    ],
  },
  {
    id: 'saude',
    termos: [
      ['saude', 3],
      ['cuidado', 2],
      ['cuide se', 3],
      ['prevenir', 2],
      ['higiene', 2],
      ['gravida', 2],
    ],
  },
  {
    id: 'risco',
    termos: [
      ['risco', 3],
      ['perigo', 3],
      ['seguro', 3],
      ['segura', 3],
      ['tempestade', 3],
      ['raio', 3],
      ['raios', 3],
      ['alagamento', 3],
      ['correnteza', 3],
      ['pode sair', 2],
      ['cuidado', 1],
    ],
  },
  {
    id: 'roupa',
    termos: [
      ['vestir', 3],
      ['o que vestir', 3],
      ['o que eu visto', 3],
      ['como me vestir', 3],
      ['roupa', 3],
      ['roupas', 3],
      ['levar na bolsa', 2],
      ['chapeu', 2],
      ['bone', 2],
      ['protetor', 2],
      ['capa de chuva', 2],
      ['bota', 3],
      ['usar', 1],
    ],
  },
  {
    id: 'local',
    termos: [
      ['rio', 3],
      ['canal', 3],
      ['mangue', 3],
      ['manguezal', 3],
      ['embarque', 3],
      ['ponto de pesca', 3],
      ['onde fica', 2],
      ['mapa', 2],
      ['distancia', 2],
      ['perto', 1],
    ],
  },
]

const pontuar = (normalizada: string, definicao: Definicao): number => {
  let total = 0
  for (const [termo, peso] of definicao.termos) {
    if (normalizada.includes(termo)) total += peso
  }
  return total
}

export interface Deteccao {
  intent: Intent
  forca: number
}

const detectarTodas = (pergunta: string): Deteccao[] => {
  const normalizada = normalizar(pergunta)

  return DEFINICOES.map((definicao) => ({
    intent: definicao.id,
    forca: pontuar(normalizada, definicao),
  }))
    .filter((d) => d.forca > 0)
    .sort((a, b) => b.forca - a.forca)
}

export const detectarIntencao = (pergunta: string): Intent =>
  detectarTodas(pergunta)[0]?.intent ?? 'desconhecido'

export const detectIntent = (pergunta: string): Intent => detectarIntencao(pergunta)

export const detectarCompostas = (pergunta: string): Intent[] =>
  detectarTodas(pergunta)
    .filter((d) => d.forca >= 2)
    .map((d) => d.intent)
    .filter((id, i, lista) => lista.indexOf(id) === i)