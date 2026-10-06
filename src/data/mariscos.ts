export interface MariscoItem {
  id: string
  nome: string
  categoria: 'marisco' | 'crustáceo' | 'peixe'
  icone: string
  foto: string
  mareIdeal: 'seca' | 'enchendo' | 'cheia' | 'vazando'
  rotuloMare: string
  explicacaoMare: string
  ondeEncontrar: string
  dicaSeguranca: string
  falaAudio: string
}

export const LISTA_MARISCOS: MariscoItem[] = [
  {
    id: 'sururu',
    nome: 'Sururu de Mangue',
    categoria: 'marisco',
    icone: '🦪',
    foto: '/images/especies/sururu.jpg',
    mareIdeal: 'seca',
    rotuloMare: 'Maré Seca (Baixa-mar)',
    explicacaoMare: 'A lama do mangue e os bancos do canal secam, deixando os cachos de sururu expostos para catar.',
    ondeEncontrar: 'Fundo da lama e bancos de areia do Canal de Santa Cruz.',
    dicaSeguranca: 'Use faca de mariscar com cautela e luvas para não cortar os dedos nas conchas afiadas.',
    falaAudio: 'Sururu de mangue. Dá na maré seca, quando a lama fica baixa. Fica no Canal de Santa Cruz. Muito cuidado ao arrancar para não cortar a mão nas conchas afiadas.',
  },
  {
    id: 'marisco',
    nome: 'Marisco de Coroa (Vôngole)',
    categoria: 'marisco',
    icone: '🐚',
    foto: '/images/especies/marisco.jpg',
    mareIdeal: 'seca',
    rotuloMare: 'Maré Seca (Baixa-mar)',
    explicacaoMare: 'As coroas e bancos de areia da praia secam totalmente, permitindo cavar a areia molhada para achar as conchas.',
    ondeEncontrar: 'Enterrado na areia da coroa e na beira da praia de Itapissuma.',
    dicaSeguranca: 'Leve chapéu ou boné e água potável, pois nas coroas não há sombra de mangue.',
    falaAudio: 'Marisco de coroa. O melhor momento é na maré seca de lua cheia ou nova, quando a coroa seca todinha. Cave na areia úmida. Leve água e chapéu ou boné para se proteger do sol.',
  },
  {
    id: 'ostra',
    nome: 'Ostra de Mangue',
    categoria: 'marisco',
    icone: '🦪',
    foto: '/images/especies/ostra.jpg',
    mareIdeal: 'seca',
    rotuloMare: 'Maré Seca (Baixa-mar)',
    explicacaoMare: 'A água baixa e revela as raízes aéreas do mangue-vermelho, onde as ostras ficam agarradas.',
    ondeEncontrar: 'Presa nas raízes do mangue-vermelho ao longo do canal.',
    dicaSeguranca: 'MUITO CUIDADO: a casca da ostra corta como navalha! Nunca vá descalça no manguezal.',
    falaAudio: 'Ostra de mangue. Tirada na maré seca, presa nas raízes de mangue-vermelho. Cuidado extremo: a casca corta fundo como navalha. Nunca vá de pé descalço para não rasgar o pé.',
  },
  {
    id: 'caranguejo',
    nome: 'Caranguejo-Uçá',
    categoria: 'crustáceo',
    icone: '🦀',
    foto: '/images/especies/caranguejo.jpg',
    mareIdeal: 'seca',
    rotuloMare: 'Maré Seca e Vazante',
    explicacaoMare: 'Com o manguezal drenado na maré baixa, as tocas na lama ficam visíveis para tirar com gancho ou com a mão.',
    ondeEncontrar: 'Em tocas fundas na lama escura do manguezal de Itapissuma.',
    dicaSeguranca: 'Atenção ao defeso da andada. Cuidado ao enfiar o braço na toca para não prender nas raízes.',
    falaAudio: 'Caranguejo-uçá. Pega na maré seca, enfiando o braço ou gancho nas tocas da lama. Respeite os meses de andada do defeso. Cuidado com raízes e arraia na água.',
  },
  {
    id: 'aratu',
    nome: 'Aratu Vermelho',
    categoria: 'crustáceo',
    icone: '🦀',
    foto: '/images/especies/aratu.jpg',
    mareIdeal: 'vazando',
    rotuloMare: 'Maré Vazando e Seca',
    explicacaoMare: 'Conforme a água desce, eles sobem e circulam nos troncos e galhas de mangue.',
    ondeEncontrar: 'Nos troncos e raízes aéreas do manguezal.',
    dicaSeguranca: 'Cuidado com os espinhos secos das galhas de mangue.',
    falaAudio: 'Aratu vermelho de mangue. Aquele vermelhinho que sobe ligeiro nos troncos quando a maré tá vazando. Pega com laço de linha ou armadilha no tronco.',
  },
  {
    id: 'tainha',
    nome: 'Tainha',
    categoria: 'peixe',
    icone: '🐟',
    foto: '/images/especies/tainha.jpg',
    mareIdeal: 'enchendo',
    rotuloMare: 'Maré Enchendo (Enchente)',
    explicacaoMare: 'A água salgada nova empurra cardumes volumosos de tainha da barra para dentro do Canal de Santa Cruz.',
    ondeEncontrar: 'Cardumes que entram pelo canal na subida da maré.',
    dicaSeguranca: 'Cuidado com a correnteza forte nos canais estreitos ao tarrafear.',
    falaAudio: 'Tainha de canal. O melhor momento é na maré enchendo, quando o cardume sobe o canal com a água nova. Ótimo de pegar com tarrafa na maré de enchente.',
  },
  {
    id: 'siri',
    nome: 'Siri Azul / Siri Mole',
    categoria: 'crustáceo',
    icone: '🦀',
    foto: '/images/especies/siri.jpg',
    mareIdeal: 'enchendo',
    rotuloMare: 'Maré Enchendo e Cheia',
    explicacaoMare: 'A água sobe cobrindo as camboas rasas e os siris circulam na beira para comer.',
    ondeEncontrar: 'Nas camboas rasas e canais do estuário de Itapissuma.',
    dicaSeguranca: 'A garra do siri aperta forte. Pegue sempre por trás da carapaça.',
    falaAudio: 'Siri azul das camboas. Pega na maré enchendo com puçá e isca de cabeça de peixe. Pegue sempre por trás do casco para a garra não prender sua mão.',
  },
  {
    id: 'robalo',
    nome: 'Robalo / Camurim',
    categoria: 'peixe',
    icone: '🐠',
    foto: '/images/especies/robalo.jpg',
    mareIdeal: 'cheia',
    rotuloMare: 'Maré Cheia (Preamar)',
    explicacaoMare: 'Com o canal cheio e fundo, o robalo caça peixes pequenos nas margens e bocas de riacho.',
    ondeEncontrar: 'Águas salobras próximas às bocas dos rios e canais fundos.',
    dicaSeguranca: 'Espinhas dorsais e opérculos afiados. Segure com pano firme.',
    falaAudio: 'Robalo ou camurim. Peixe nobre do estuário. Dá muito na maré cheia, caçando nas margens fundas do canal. Bom de linha com isca viva e rede de espera.',
  },
]