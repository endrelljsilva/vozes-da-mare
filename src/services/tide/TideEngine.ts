/**
 * Motor de Maré Astronômica para o Litoral Norte de Pernambuco (Canal de Santa Cruz / Itapissuma)
 * Coordenadas: Lat -7.665, Lon -34.83
 *
 * Baseado no modelo harmônico semidiurno da costa de Pernambuco (Porto do Recife / Barra de Catuama):
 * - Período do ciclo semidiurno lunar M2: ~12.4206 horas (12h 25min entre preamares)
 * - Variação de Sizígia (maré viva / lua cheia ou nova): amplitude de 0.1m a 2.5m
 * - Variação de Quadratura (maré morta / quarto crescente ou minguante): amplitude de 0.8m a 1.7m
 * - 100% gratuito, offline-first, sem dependência de APIs externas pagas.
 */

export interface EventoMare {
  tipo: 'baixa-mar' | 'preamar'
  rotulo: string
  horario: string // "HH:mm"
  dataHora: Date
  alturaMetros: number
  descricao: string
}

export interface StatusMareMomento {
  alturaAtual: number // Ex: 1.2m
  fase: 'secando' | 'enchendo' | 'estofa-baixa' | 'estofa-alta'
  rotuloFase: string
  proximaMare: EventoMare
  proximaBaixaMar: EventoMare // A maré de ouro para a marisqueira!
  tipoDia: 'maré grande (viva)' | 'maré de transição' | 'maré pequena (morta)'
  faseLua: string
  iconeLua: string
  mensagemVoz: string
  favoravelMariscar: boolean
}

/** Calcula a fase lunar aproximada (0 a 1, onde 0 e 1 = Lua Nova, 0.5 = Lua Cheia) */
function calcularFaseLua(data: Date): { fase: number; nome: string; icone: string } {
  // Conhecida lua nova de referência: 11 de Janeiro de 2024 às 11:57 UTC
  const referenciaNova = new Date('2024-01-11T11:57:00Z').getTime()
  const cicloLunarMs = 29.53058770576 * 24 * 60 * 60 * 1000
  const diff = data.getTime() - referenciaNova
  const fase = ((diff % cicloLunarMs) + cicloLunarMs) % cicloLunarMs / cicloLunarMs

  if (fase < 0.05 || fase > 0.95) return { fase, nome: 'Lua Nova', icone: '🌑' }
  if (fase < 0.20) return { fase, nome: 'Lua Crescente', icone: '🌒' }
  if (fase < 0.30) return { fase, nome: 'Quarto Crescente', icone: '🌓' }
  if (fase < 0.45) return { fase, nome: 'Crescente Gibosa', icone: '🌔' }
  if (fase < 0.55) return { fase, nome: 'Lua Cheia', icone: '🌕' }
  if (fase < 0.70) return { fase, nome: 'Minguante Gibosa', icone: '🌖' }
  if (fase < 0.80) return { fase, nome: 'Quarto Minguante', icone: '🌗' }
  return { fase, nome: 'Lua Minguante', icone: '🌘' }
}

/** Calcula a altura da maré em um determinado timestamp (em metros) */
export function calcularAlturaMare(data: Date): number {
  const tHoras = data.getTime() / (1000 * 60 * 60)
  
  // Períodos em horas das principais componentes harmônicas na costa de Pernambuco
  const periodoM2 = 12.4206012 // Lunar principal
  const periodoS2 = 12.0000000 // Solar principal
  
  // Fase lunar modula a amplitude entre sizígia (viva) e quadratura (morta)
  const lua = calcularFaseLua(data)
  // Sizígia ocorre quando fase está próxima de 0 (Nova) ou 0.5 (Cheia)
  const distSizigia = Math.abs(Math.sin(lua.fase * 2 * Math.PI)) // 0 em sizígia, 1 em quadratura
  const fatorAmplitude = 1.0 - 0.45 * distSizigia // Amplitude varia de ~0.55x a ~1.0x

  // Onda fundamental
  const nivelMedio = 1.30 // Nível médio do mar em metros em Itapissuma/Recife
  const ampM2 = 0.95 * fatorAmplitude
  const ampS2 = 0.25 * fatorAmplitude

  // Fase ajustada para o fuso GMT-3
  const faseM2 = 2.45
  const faseS2 = 1.15

  const h = nivelMedio +
    ampM2 * Math.cos((2 * Math.PI * tHoras / periodoM2) - faseM2) +
    ampS2 * Math.cos((2 * Math.PI * tHoras / periodoS2) - faseS2)

  return Math.max(0.1, Math.min(2.7, Number(h.toFixed(2))))
}

/** Encontra os 4 eventos de maré (picos e vales) para um determinado dia */
export function calcularEventosDoDia(dataBase: Date): EventoMare[] {
  const ano = dataBase.getFullYear()
  const mes = dataBase.getMonth()
  const dia = dataBase.getDate()
  
  const eventos: EventoMare[] = []
  const passoMinutos = 5
  const totalPassos = (24 * 60) / passoMinutos

  let anterior = calcularAlturaMare(new Date(ano, mes, dia, 0, 0))
  let atual = calcularAlturaMare(new Date(ano, mes, dia, 0, passoMinutos))

  for (let i = 1; i < totalPassos - 1; i++) {
    const minutos = (i + 1) * passoMinutos
    const proximoDate = new Date(ano, mes, dia, Math.floor(minutos / 60), minutos % 60)
    const proximo = calcularAlturaMare(proximoDate)

    const dataAtual = new Date(ano, mes, dia, Math.floor((i * passoMinutos) / 60), (i * passoMinutos) % 60)

    // Detecção de pico (Preamar)
    if (atual > anterior && atual >= proximo) {
      const horaStr = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      eventos.push({
        tipo: 'preamar',
        rotulo: 'Maré Cheia (Preamar)',
        horario: horaStr,
        dataHora: dataAtual,
        alturaMetros: atual,
        descricao: 'A água está no ponto mais alto. O manguezal fica submerso.',
      })
    }
    // Detecção de vale (Baixa-mar)
    else if (atual < anterior && atual <= proximo) {
      const horaStr = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      eventos.push({
        tipo: 'baixa-mar',
        rotulo: 'Maré Seca (Baixa-mar)',
        horario: horaStr,
        dataHora: dataAtual,
        alturaMetros: atual,
        descricao: 'Melhor momento! A lama e as coroas de areia aparecem para catar marisco.',
      })
    }

    anterior = atual
    atual = proximo
  }

  return eventos
}

/** Obtém o status completo e falado para o momento atual */
export function obterStatusMareMomento(agora: Date = new Date()): StatusMareMomento {
  const alturaAgora = calcularAlturaMare(agora)
  const daquiA15Min = calcularAlturaMare(new Date(agora.getTime() + 15 * 60 * 1000))
  const ha15Min = calcularAlturaMare(new Date(agora.getTime() - 15 * 60 * 1000))

  const delta = daquiA15Min - ha15Min
  let fase: StatusMareMomento['fase'] = 'secando'
  let rotuloFase = 'A maré está secando (vazando)'

  if (Math.abs(delta) < 0.04) {
    if (alturaAgora < 0.8) {
      fase = 'estofa-baixa'
      rotuloFase = 'A maré está no fundo (estofa baixa)'
    } else {
      fase = 'estofa-alta'
      rotuloFase = 'A maré está no topo (estofa cheia)'
    }
  } else if (delta > 0) {
    fase = 'enchendo'
    rotuloFase = 'A maré está enchendo'
  } else {
    fase = 'secando'
    rotuloFase = 'A maré está secando (vazando)'
  }

  // Pega eventos de hoje e de amanhã para garantir que encontramos a próxima maré
  const hojeEventos = calcularEventosDoDia(agora)
  const amanha = new Date(agora)
  amanha.setDate(amanha.getDate() + 1)
  const amanhaEventos = calcularEventosDoDia(amanha)
  const todosEventos = [...hojeEventos, ...amanhaEventos]

  const futuros = todosEventos.filter((e) => e.dataHora.getTime() > agora.getTime())
  const proximaMare = futuros[0] || hojeEventos[0] || {
    tipo: 'baixa-mar' as const,
    rotulo: 'Maré Seca',
    horario: '10:00',
    dataHora: agora,
    alturaMetros: 0.4,
    descricao: 'Maré baixa.',
  }

  const proximaBaixaMar =
    futuros.find((e) => e.tipo === 'baixa-mar') ||
    todosEventos.find((e) => e.tipo === 'baixa-mar') ||
    proximaMare

  const lua = calcularFaseLua(agora)
  const isSizigia = lua.nome.includes('Nova') || lua.nome.includes('Cheia')
  const isQuadratura = lua.nome.includes('Quarto')

  const tipoDia = isSizigia
    ? 'maré grande (viva)'
    : isQuadratura
      ? 'maré pequena (morta)'
      : 'maré de transição'

  // Mensagem simples pensada para marisqueira que ouve em áudio
  const favoravelMariscar = alturaAgora <= 0.9 || fase === 'secando' || fase === 'estofa-baixa'

  let mensagemVoz = ''
  if (fase === 'secando' || fase === 'estofa-baixa') {
    mensagemVoz = `A maré tá secando agora, com ${alturaAgora} metros. A maré mais seca vai ser às ${proximaBaixaMar.horario}. `
    if (favoravelMariscar) {
      mensagemVoz += 'Tá bom de ir pro mangue catar marisco! Mas fique de olho no horário pra não ser pega na volta.'
    }
  } else {
    mensagemVoz = `A maré tá enchendo agora, já tá com ${alturaAgora} metros. O topo da maré cheia vai ser às ${proximaMare.horario}. `
    mensagemVoz += 'Cuidado no canal e no mangueçal porque a água tá subindo.'
  }

  return {
    alturaAtual: alturaAgora,
    fase,
    rotuloFase,
    proximaMare,
    proximaBaixaMar,
    tipoDia,
    faseLua: lua.nome,
    iconeLua: lua.icone,
    mensagemVoz,
    favoravelMariscar,
  }
}
