/*
 * Pilha de navegação interna — lógica pura, sem React.
 *
 * Existe para o botão "voltar" nunca fazer a usuária sair do aplicativo.
 * Usar `navigate(-1)` do navegador quebra em três situações comuns:
 *  1. o app é aberto direto em /clima (atalho salvo, PWA reabrindo a tela);
 *  2. a página é recarregada em conexão instável;
 *  3. a usuária chegou pelo link "Falar com a Maré" da tela de abertura.
 * Nesses casos não há histórico anterior, e o navegador sai do site ou
 * mostra uma página em branco — que é exatamente a sensação de
 * "o botão não funciona".
 */

const pilha: string[] = []
let indice = -1

/** Garante que a tela inicial seja a base da pilha. */
const garantirRaiz = (): void => {
  if (indice === -1) {
    pilha.push('/')
    indice = 0
  }
}

/** Registra a rota atual, tratando tanto a ida quanto a volta. */
export const registrarRota = (pathname: string): void => {
  garantirRaiz()

  if (pilha[indice] === pathname) return

  const jaConhecido = pilha.lastIndexOf(pathname, indice)
  if (jaConhecido !== -1) {
    // É um retorno: descarta o que ficou à frente em vez de duplicar a entrada.
    indice = jaConhecido
    pilha.length = indice + 1
    return
  }

  pilha.push(pathname)
  indice = pilha.length - 1
}

/** Rota para onde "voltar" deve ir. Sempre uma rota interna. */
export const rotaAnterior = (pathnameAtual: string): string => {
  garantirRaiz()
  if (indice > 0 && pilha[indice - 1] !== pathnameAtual) return pilha[indice - 1]
  return '/'
}

/** Define a rota comovisitada, sem empilhar (usado ao ir para o Início). */
export const irParaInicio = (): string => {
  garantirRaiz()
  const posicao = pilha.indexOf('/')
  if (posicao !== -1) {
    indice = posicao
    pilha.length = indice + 1
  }
  return '/'
}

/** Usado nos testes para partir de um estado limpo. */
export const reiniciarHistorico = (): void => {
  pilha.length = 0
  indice = -1
}
