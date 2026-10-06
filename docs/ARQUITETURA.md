# Arquitetura — Vozes da Maré

> Decisões técnicas e o motivo de cada uma. Para instalar e rodar, veja o `README.md`.

## 1. O fluxo

```
┌─────────────────────────────────────────────────────────┐
│ pages/            Tela: junta dados e decide o que mostrar│
└───────────────┬─────────────────────────────────────────┘
                │ props
┌───────────────▼─────────────────────────────────────────┐
│ components/     Blocos visuais reutilizáveis, sem I/O    │
└───────────────┬─────────────────────────────────────────┘
                │ props
┌───────────────▼─────────────────────────────────────────┐
│ hooks/          Regras de tela: online, loading, cache   │
└───────────────┬─────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────┐
│ services/      ÚNICA camada que fala com a rede          │
└───────────────┬─────────────────────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
┌───────▼──────┐  ┌──────▼───────┐
│ Open-Meteo   │  │  Supabase    │
│ OSM / Leaflet│  │  (PostgreSQL)│
└──────────────┘  └──────────────┘
```

`types/` define os contratos que atravessam todas as camadas. Nenhuma dependência
aponta para cima.

**Consequência prática:** trocar o Open-Meteo por outra fonte, ou o Supabase por um
arquivo JSON offline, é uma mudança em **um** arquivo — a interface não sabe de onde
o dado veio.

## 2. Decisões e justificativas

| Decisão                               | Alternativa descartada          | Motivo                                                                 |
| ------------------------------------- | ------------------------------- | ---------------------------------------------------------------------- |
| TypeScript em 100% do código          | JavaScript com JSDoc            | O projeto vai crescer; a tipagem é a documentação que não desatualiza  |
| Tailwind v4 com `@theme`              | CSS modules / styled-components | Os tokens de cor saem da logo uma vez só e não há duplicação de valor  |
| Rotas em português (`/clima`, `/voz`) | `/weather`, `/voice`            | Quem mantém é a equipe local; o código também é legível para ela       |
| Rotas com `lazy()`                    | Um bundle só                    | Bundle inicial caiu de **657 kB → 267 kB**; importa muito em 3G        |
| Web Speech API nativa                 | biblioteca de STT/STT paga      | Custo zero garantido, sem chave, sem vazamento de áudio para terceiros |
| Ícones e ilustrações em SVG           | Emoji, banco de imagens         | §24 do projeto: linguagem visual própria e consistente                 |
| Personagem como SVG paramétrico       | Imagens por expressão           | Seis expressões, uma fonte de verdade, cor herdada da marca            |
| Provedor abstrato `TideProvider`      | Número "estimado" na tela       | §10: preferimos admitir a falta a inventar medição                     |
| RLS por tabela                        | Banco aberto                    | Um `select` sem chave é barato; um vazamento de dado local não         |

## 3. Identidade visual

A paleta foi **amostrada do arquivo oficial `logo.png`**, não estimada:

| Hex                           | Papel                          | Origem                                     |
| ----------------------------- | ------------------------------ | ------------------------------------------ |
| `#82B6CB`                     | azul pastel (`mare-400`)       | logo                                       |
| `#FCDCBD`                     | creme/areia (`areia-200`)      | logo                                       |
| `#FBEAD6`                     | creme claro (`areia-100`)      | logo                                       |
| `#F48653`                     | laranja pastel (`laranja-500`) | logo                                       |
| `#22414F`                     | tinta do texto                 | azul da marca escurecido para contraste AA |
| `#7FB87C` `#F2C75E` `#E57878` | positivo / atenção / perigo    | tons suaves, nunca neon                    |

Tokens vivem em `src/index.css`, dentro de `@theme` do Tailwind v4. A logo é usada como
PNG original em `public/logo.png`; os ícones do PWA são essa mesma imagem com margem —
**sem redesenho, sem alteração de cor**.

## 4. Personagem

`src/components/Character/Personagem.tsx` desenha uma pescadora com chapéu de palha,
blusa coral e macacão azul. As seis expressões (`feliz`, `normal`, `atencao`, `risco`,
`saude`, `falando`) alteram olhos, sobrancelhas e boca — e nada mais.

Ela não é enfeite: cada expressão é escolhida a partir do estado real da tela
(`expressaoDoDia(report)` no clima, contagem de riscos em `Risks`), e o balão de fala
traz a mesma informação em uma frase.

## 5. A assistente de voz

```
fala → VoiceInput      (diagnóstico: https? microfone? permissão?)
     → intents.ts      (pontuação por termos → 14 intenções)
     → AssistantEngine (memória de conversa + resposta composta)
     → VoiceOutput     (voz pt-BR do sistema, se existir)
     → Conversa        (a mesma resposta em texto na tela)
```

**Por que não um modelo de linguagem.** Três motivos, todos do §28 e do §17:

- IAs de verdade exigem chave de API, cartão de crédito ou um modelo pesado no
  aparelho. Incompatível com orçamento zero e com 3G instável.
- Mandar a voz da usuária a um servidor de terceiro tem implicação de saúde e
  privacidade que este projeto não pode assumir.
- O §17 exige nunca inventar. Um modelo que "chuta" é exatamente o oposto.

No lugar: **pontuação por termos**. Cada intenção declara termos com pesos; vence a
de maior soma. Determinístico, offline, sem chave e sem custo.

```
"Posso sair para pescar?"  → pescar_agora (peso 3 em "posso sair" + 3 em "sair para pescar")
"e o vento agora?"         → clima, reaproveitando o clima já buscado
"quem é você?"             → desconhecido → "essa eu não sei, mas posso falar sobre…"
```

Quatro garantias — todas com teste:

1. **Não inventa.** Sem dado, ela diz que não tem. Maré segue sem número inventado.
2. **Não diagnostica.** Sintoma vira orientação pelo sintoma citado + encaminhamento.
3. **Não promete segurança.** Diz "as condições estão favoráveis", nunca "é seguro".
4. **Não trava.** Sem microfone, sem internet ou API fora do ar, os botões continuam.

A resposta falada é **também** exibida como texto. Quem não consegue ouvir ainda lê.

### O sotaque

A Web Speech API **não tem vozes próprias**: usa as do sistema. No Windows só vêm
vozes em inglês por padrão, e sem uma voz pt-BR o navegador lê o português com
sotaque americano.

Por isso `VoiceOutput` expõe `avaliarVoz()`, que devolve três estados —
`brasileira`, `sem-pt-br`, `mudo` — e a tela mostra um cartão com o passo a passo
de instalação em Windows, Android e iPhone. A usuária descobre o problema em vez de
ouvir algo errado sem explicação.

A busca da voz ignora o campo `lang` de propósito: algumas vozes do Windows trazem
o português no nome e o idioma marcado de forma inconsistente.

## 6. Maré: como não inventar

```
TideProvider (interface)
├── TideProviderDemo  → isDemo: true, devolve []
└── TideProviderReal  → [PRECISA SER VERIFICADO] fonte gratuita para Itapissuma
```

`isDemo` é lido pela interface para **exibir o selo “Demonstração”**. É uma regra
verificada por teste: a tela de maré não tem como mostrar um número como se fosse real.

## 7. Offline

- **Precache** (Workbox): interface, fontes das ilustrações, logo e ícones.
- **Runtime `CacheFirst`**: fontes Google, tiles do OpenStreetMap.
- **Runtime `NetworkFirst`** (6 s de timeout): Open-Meteo e Supabase.
- **Regra visível:** `useOnlineStatus` anuncia 🟢/🟡 e as telas de clima dizem
  "os dados podem estar antigos". Nada finge estar atualizado offline.

## 8. Navegação

O botão **Voltar** não usa `navigate(-1)`. O histórico do navegador é apagado a cada
recarregamento e não existe quando o app é aberto direto numa tela — pior, ele
levaria a usuária para fora do site.

`src/lib/historico.ts` guarda uma pilha de rotas internas, em memória pura (testável
sem navegador), e `useHistoricoInterno` a conecta ao router:

```
pilha: ['/', '/clima', '/saude']   índice: 2
Voltar  → '/clima'  e trunca a pilha
Voltar  → '/'
Voltar  → '/'      (não sai do app)
```

O botão **Início** da navegação inferior também descarta o que havia antes de `/`,
para que o Voltar aponte sempre para a tela anterior real.

## 9. Segurança

- Frontend tem **apenas** variáveis públicas (`VITE_*`). A service role key nunca entra no bundle.
- RLS ativa em todas as tabelas: leitura pública do conteúdo educativo; escrita só com
  conta autenticada; cada pessoa vê e apaga apenas os próprios relatos.
- `community_reports` não é público — pode conter dados de saúde.
- `.env` está no `.gitignore`; só o `.env.example` é versionado.

## 10. Acessibilidade

- Alvos de toque ≥ 44 px; o botão de voz tem 96 px.
- Nenhuma informação depende **só** de cor: todo nível de risco tem nome e símbolo.
- `aria-label` em ícones, `aria-live` em respostas e no estado online, foco visível
  global, navegação completa por teclado.
- `prefers-reduced-motion` desliga ondas, flutuação e pulsos.
- Contraste AA: tinta `#22414F` sobre fundo creme `#FBEAD6`.

## 11. Plano de fases

| Fase | Conteúdo                                                                             | Estado                                          |
| ---- | ------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 1    | Projeto, Tailwind, ESLint, Prettier, PWA, identidade visual, navegação, tela inicial | ✅                                              |
| 2    | Clima com Open-Meteo, estados de carregamento e offline                              | ✅                                              |
| 3    | Mapa Leaflet/OSM, marcadores próprios, filtro por tipo                               | ✅                                              |
| 4    | Banco Supabase, espécies, cards ilustrados                                           | ✅                                              |
| 5    | Saúde: educação, unidades, como chegar                                               | ✅                                              |
| 6    | Central de riscos                                                                    | ✅                                              |
| 7    | Maré                                                                                 | ⏸ interface pronta, aguardando fonte verificada |
| 8    | Assistente de voz                                                                    | ✅                                              |
| 9    | PWA e modo offline parcial                                                           | ✅                                              |
| 10   | Testes e otimização                                                                  | ✅ 26 testes · bundle 267 kB                    |

**Próximo passo obrigatório da Fase 7:** pesquisar uma fonte gratuita de maré com
dados válidos para Itapissuma e documentar em `README.md` §13 antes de escrever
qualquer linha de provider real.
