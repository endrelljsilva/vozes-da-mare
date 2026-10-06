# 🌊 Vozes da Maré

Aplicativo web instalável (PWA) para **pescadoras artesanais e moradores de Itapissuma, Pernambuco**.
Reúne, de forma visual e falada, o que a pessoa precisa saber antes de sair para a água:
clima, mapa, peixes, riscos, saúde e — em breve — maré.

O diferencial é a **assistente de voz**: a usuária aperta um botão, pergunta em português
com as próprias palavras e ouve a resposta.

> **Este aplicativo não substitui uma avaliação profissional de saúde e nunca promete
> segurança absoluta.** Ele informa e encaminha.

---

## 1. O que é o Vozes da Maré

Um aplicativo pensado para quem usa a água para viver e para trabalhar, e para quem tem
pouca familiaridade com telas. Cada informação foi desenhada para ser entendida **antes
de ser lida**: cards grandes, ícones desenhados à mão, cores da marca e uma personagem
que explica em voz alta.

## 2. Objetivo

- Levar à pescadora, em linguagem simples, o estado do tempo, do vento e da maré.
- Mostrar pontos de pesca, manguezais, canais, embarcadouros e unidades de saúde no mapa.
- Ensinar, sem diagnosticar, sobre saúde da mulher.
- Funcionar parcialmente **offline** — quem perde sinal não fica sem o aplicativo.

## 3. Tecnologias

| Camada    | Escolha                                 | Por quê                                                                   |
| --------- | --------------------------------------- | ------------------------------------------------------------------------- |
| Interface | React 19 + TypeScript + Vite            | Tipagem protege um projeto que vai crescer sem devsCCN.clientes full-time |
| Estilo    | Tailwind CSS v4                         | Tokens de cor tirados da própria marca                                    |
| rotas     | React Router v7                         | Padrão da comunidade                                                      |
| Mapa      | Leaflet + React-Leaflet + OpenStreetMap | Open source, sem chave, sem cartão de crédito                             |
| Banco     | Supabase (PostgreSQL + RLS)             | Plano gratuito, RLS por tabela                                            |
| Voz       | Web Speech API (nativa do navegador)    | Zero dependência, zero custo                                              |
| PWA       | vite-plugin-pwa / Workbox               | Instalação no celular e cache                                             |
| Testes    | Vitest                                  | Mesma cadeia do Vite, sem bônus de configuração                           |

**Nenhuma dependência paga. Nenhuma chave que exija cartão de crédito.**

## 4. Como instalar

Requisitos: **Node.js 20+** ou [**bun**](https://bun.sh). Não é preciso os dois.

```bash
bun install     # ou: npm install
```

## 5. Como executar

```bash
bun run dev       # servidor local em http://localhost:5173
bun run build     # tsc + vite + service worker
bun run preview   # serve o build de produção
bun run test      # testes (vitest)
bun run lint      # ESLint
bun run format    # Prettier
```

## 6. Configurar o `.env`

```bash
cp .env.example .env
```

| Variável                 | Para quê                            | Limite gratuito        |
| ------------------------ | ----------------------------------- | ---------------------- |
| `VITE_SUPABASE_URL`      | Endereço do projeto Supabase        | —                      |
| `VITE_SUPABASE_ANON_KEY` | Chave pública de leitura (anon)     | Ilimitado para leitura |
| `VITE_SPEECH_API_URL`    | Reservado para fonte de maré futura | —                      |

> 🔒 **Nunca** coloque a `service role key` no frontend, nem no `.env`. Ela é para o
> servidor. O arquivo `.env` está no `.gitignore` e só o `.env.example` vai para o repositório.

**Sem nenhuma variável configurada o aplicativo continua funcionando**, usando os dados
locais de `src/data/` (marcados com `[PRECISA SER VERIFICADO]`).

## 7. Configurar o Supabase

1. Crie um projeto em <https://supabase.com> (plano gratuito).
2. Abra **SQL Editor** e rode, nesta ordem:
   - `supabase/migrations/001_init.sql` — tabelas de conteúdo + RLS
   - `supabase/migrations/002_users_and_policies.sql` — perfis e políticas de escrita
   - `supabase/seed.sql` — espécies iniciais
3. Em **Project Settings → API**, copie a URL e a **anon key** para o `.env`.
4. Se for usar relatos da comunidade, crie um bucket **privado** para as imagens.

O aplicativo detecta a ausência do Supabase sozinho e cai para os dados locais —
nunca fica com tela branca.

## 8. Configurar as APIs

| Serviço                               | Chave? | Observação                                                                 |
| ------------------------------------- | ------ | -------------------------------------------------------------------------- |
| **Open-Meteo** (`api.open-meteo.com`) | Não    | Clima de Itapissuma. Sem limite rígido documentado; usamos poucos requests |
| **OpenStreetMap** tiles               | Não    | Exige manter a atribuição visível no mapa                                  |
| **Web Speech API**                    | Não    | Reconhecimento e síntese. **Exige `https://` ou `localhost`** — ver §12    |

### Maré — ainda sem fonte

Nenhuma API gratuita com estação válida para Itapissuma foi confirmada até agora.
Enquanto isso, a interface implementa a interface `TideProvider` e mostra um selo
**"Demonstração"**. Para conectar uma fonte real, implemente `TideProvider` em
`src/services/tide/` e troque a instância em `src/pages/Tide/index.tsx`. **Nenhum número
fictício é apresentado como medição.**

## 9. Como fazer deploy

Recomendado: **Cloudflare Pages** (plano gratuito, sem cartão para `*.pages.dev`).
Alternativas equivalentes: Vercel e Netlify.

```bash
bun run build      # gera dist/
```

- **Cloudflare Pages / Netlify:** repositório Git → framework _Vite_ → comando
  `bun run build`, diretório `dist`. O arquivo `public/_redirects` já entra no build
  e resolve o SPA fallback — não é preciso configurar nada no painel.
- **Vercel:** import do repositório; detecta Vite sozinho. O `vercel.json` da raiz
  define o mesmo fallback, além do cache dos arquivos com hash.
- **Roteamento:** o app usa URLs como `/clima`. Sem o fallback para `index.html`,
  abrir ou recarregar um link direto devolve 404 — e parece que os botões pararam de
  funcionar. Se hospedar em outro servidor, configure o rewrite de `/(.*)` para
  `/index.html`.
- **Variáveis:** cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no painel.

### Como testar a voz no celular

O microfone exige `https://`. Abrir pelo IP da rede (`http://192.168.x.x:5173`)
**não funciona** — e o app avisa isso na tela.

**No computador:** `http://localhost:5173` já é contexto seguro. Basta abrir.

**No celular:** publique, ou exponha o servidor por um túnel temporário.

```bash
# 1. sobe o app
bun run dev

# 2. em outro terminal, cria o túnel (gratuito, sem conta)
cloudflared tunnel --url http://localhost:5173
```

O comando imprime um endereço `https://algo.trycloudflare.com`. Abra no celular,
vá em **Voz** e toque no microfone.

O `vite.config.ts` já libera `.trycloudflare.com` em `server.allowedHosts` — o Vite
bloqueia hosts desconhecidos por padrão, e essa liberação vale **só** para
`vite dev`, nunca para o build de produção.

Para encerrar o túnel: `Ctrl+C` no terminal, ou feche o processo `cloudflared`.
Ele é público — qualquer pessoa com o endereço consegue abrir o app enquanto
estiver no ar.

**Atenção ao testar:** o reconhecimento do Chrome envia o áudio para servidores do
Google, então o celular precisa de internet. No iPhone, o reconhecimento de voz do
Safari é inconsistente — teste no Chrome do Android.

### Botões Início e Voltar

Funcionam por um histórico **interno** (`src/lib/historico.ts`), não pelo histórico
do navegador. Isso importa em três situações reais: abrir o app direto numa tela
(atalho salvo, ou PWA reabrindo a última tela), recarregar a página em conexão
instável, e entrar pelo atalho de voz da tela de abertura. Nesses casos não existe
histórico anterior — sem a pilha interna, "Voltar" tiraria a usuária do site.
Quando não há para onde voltar, o botão vai para o Início.

## 10. Estrutura do projeto

```
src/
├── assets/logo/            logo oficial (PNG, sem alterações)
├── components/
│   ├── Button/  Card/  Faixa/  Tela/  Topo.tsx  BottomNav.tsx
│   ├── Character/          personagem SVG + balão de fala (6 expressões)
│   ├── FishCard/  RiskCard/  VoiceButton/  VoiceAssistant/
│   ├── Map/                Leaflet, marcadores SVG próprios, filtro por tipo
│   └── illustrations/      biblioteca de ícones e ondas em SVG
├── pages/                  Abertura, Home, Weather, Tide, Map, Fish, Risks, Health, VoiceAssistant
├── services/               weather, tide, map, fish, health, risks, assistant
├── hooks/                  useOnlineStatus
├── lib/                    supabase, env, utils
├── types/                  contratos TypeScript compartilhados
├── data/                   conjuntos locais rotulados como pendentes de verificação
├── tests/                  testes de serviço (31 casos)
├── lab/personagem.tsx      laboratório visual da personagem (só desenvolvimento)
personagem-lab.html          abre o laboratório em /personagem-lab.html
supabase/
├── migrations/             001_init.sql, 002_users_and_policies.sql
└── seed.sql
```

### Laboratórios visuais (só desenvolvimento)

Duas páginas para ajustar desenho sem caçar na tela do celular. **Não entram** no
build de produção.

| Arquivo               | Abre                   | Serve para                                                    |
| --------------------- | ---------------------- | ------------------------------------------------------------- |
| `personagem-lab.html` | `/personagem-lab.html` | as 6 expressões da personagem lado a lado, em 2 tamanhos      |
| `ondas-lab.html`      | `/ondas-lab.html`      | a faixa de ondas em 2 larguras, com as medidas do SVG na tela |

O laboratório das ondas existe porque o ladrilho da rolagem é fácil de errar em
silêncio: se o desenho não se repetir a cada 720 unidades, aparece um degrau que só
dá para ver rolando. A medida do SVG na tela diz na hora se o problema é largura,
posição ou caminho.

> **Regra de montagem do desenho:** as peças se encaixam por **sobreposição**, nunca por
> borda encostada. Se o queixo termina em 125 e o pescoço começa em 112, os 13 px de
> interseção garantem que não abra um vão e a cabeça pareça solta sobre o corpo.

> **Regra da animação das ondas:** o SVG tem `width: 200%` e rola com
> `translateX(-50%)`. Metade de "200% do container" vale um container inteiro — então
> o desenho precisa repetir a cada **720 unidades** do viewBox, não a cada 1440.

> **Regra de montagem do desenho:** as peças se encaixam por **sobreposição**, nunca por
> borda encostada. Se o queixo termina em 125 e o pescoço começa em 112, os 13 px de
> interseção garantem que não abra um vão e a cabeça pareça solta sobre o corpo.

**A regra que sustenta o projeto:** `pages → components → services → APIs`.
Nenhum componente chama `fetch` ou `supabase` diretamente. Trocar a fonte de um dado
é mexer em **um** arquivo.

> Desvio consciente do plano original: `assets/` guarda **arquivos** (a logo),
> `components/` guarda **SVG escritos em React**. Duplicar os dois geraria ambiguidade.

## 11. Como contribuir

1. Abra uma issue descrevendo a mudança e **de onde veio a informação**.
2. Um branch por tema: `feat/mapa-legenda`, `fix/mare-provider`.
3. Rode `bun run lint && bun run test && bun run build` antes do PR.
4. Toda informação nova precisa de **fonte verificável** e data da verificação.

### Regras que não se negociam

- Não inventar espécie,-local, horário, telefone, maré ou previsão.
- Não usar serviço pago nem serviço que exija cartão de crédito.
- Não fazer diagnóstico médico nem prometer segurança absoluta.
- Não colocar segredo no frontend.
- Toda imagem é SVG nossa ou a logo oficial. Nada de banco de imagens aleatório.

## 12. Limitações conhecidas

- **Voz — só funciona em `https://` ou `localhost`.** É a restrição mais
  importante e a que mais confunde: ao abrir o app pelo endereço da rede local
  (`http://192.168.0.110:5173`) para testar no celular, **o navegador bloqueia
  o microfone silenciosamente**. Não é bug do app — é regra do navegador. Para
  testar no celular, publique (Cloudflare Pages dá `https://` de graça) ou use um
  túnel. O próprio app detecta a situação e diz o que fazer.
- **Voz — o Chrome envia o áudio para servidores do Google.** Sem internet, o
  reconhecimento falha com "sem conexão". Num projeto cujo público vive onde o
  sinal cai, isso é uma limitação real, não um detalhe. Por isso os botões de
  pergunta sempre funcionam.
- **Voz — a resposta falada depende do aparelho.** Onde não há síntese de voz, a
  resposta aparece só em texto, e a tela avisa.
- **Clima:** o Open-Meteo não publica SLA. Em uso intenso (várias pessoas na mesma
  rede, muitas recargas) ele pode limitar requisições — nesse caso a tela mostra
  "Não conseguimos atualizar o clima agora" e o resto do app segue funcionando.
- **Maré:** sem fonte verificada — a tela mostra aviso, não número.
- **Offline:** interface, ilustrações, espécies e unidades já visitadas ficam em cache.
  Clima, maré e relatos recentes **precisam** de internet, e o app diz quando está offline.
- **Mapa:** os pontos são aproximados e aguardam validação da equipe.
- **GPS:** não é usado por padrão. Se for ativado, a permissão é explicada antes.

## 13. O que se atualiza e o que não

Pergunta honesta: **os dados mudam de um dia para o outro?**

| Dado                          | Atualiza?                                 | Como                                                              |
| ----------------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| **Clima atual**               | ✅ a cada abertura e no botão "Atualizar" | Open-Meteo, leitura do momento                                    |
| **Previsão horária e diária** | ✅ a cada leitura                         | Open-Meteo                                                        |
| **Riscos**                    | ✅ derivado do clima do dia               | Índice uv, rajada, chance de chuva, temperatura e código do tempo |
| **Maré**                      | ❌ **não existe ainda**                   | Provider em modo demonstração, sempre com selo                    |
| **Correnteza**                | ❌ sem dado                               | Card mostra "sem dados"                                           |
| **Peixes**                    | ❌ fixo                                   | Conteúdo educativo, muda quando a equipe revisar                  |
| **Unidades de saúde**         | ❌ fixo                                   | Vem do Supabase quando configurado                                |
| **Pontos do mapa**            | ❌ fixo                                   | Estão marcados como aproximados                                   |
| **Relatos da comunidade**     | ✅ quando houver                          | Falta a Fase de relatos                                           |

### Três detalhes que evitam número velho

1. **Botão "Atualizar"** nas telas Clima e Riscos quebra o cache do navegador
   (`cache: 'no-store'` + marca-hora na URL). A Open-Meteo não manda
   `Cache-Control`, então essa proteção não é garantida por ela.
2. **Duas horas aparecem na tela:** a _hora da observação_ no local e a _hora em que
   baixamos_. São coisas diferentes, e só mostrar a segunda engana.
3. **Na releitura, a tela não pisca.** A leitura anterior fica na tela enquanto a nova
   chega; se a nova falha, aparece um aviso saying que o dado é da leitura anterior.

### Quando falta dado, o aplicativo diz que falta

Os riscos têm quatro níveis, e um deles é **"sem dados"** (⚪). Maré e correnteza
usam sempre esse nível enquanto não houver fonte verificada — não um "baixo risco"
inventado para a tela parecer completa. É a mesma regra da §17: a Maré prefere
admitir que não sabe.

> Um bug real que a revisão encontrou: `assessRisks()` não recebia nada e devolvia
> "atenção" para as nove categorias, todo dia. A tela afirmava "Hoje há pontos de
> atenção" sem nenhum dado por trás. Agora cada categoria é classificada a partir
> da leitura real.

---

## 14. Fontes dos dados

| Dado                         | Fonte                                                               | Situação                      |
| ---------------------------- | ------------------------------------------------------------------- | ----------------------------- |
| Clima, vento, chuva, umidade | [Open-Meteo](https://open-meteo.com)                                | ✅ em uso                     |
| Mapa base e tiles            | [OpenStreetMap](https://www.openstreetmap.org/copyright)            | ✅ em uso                     |
| Maré                         | —                                                                   | ⚠️ `[PRECISA SER VERIFICADO]` |
| Peixes                       | Conhecimento público sobre a fauna costeira/estuarina de Pernambuco | ⚠️ revisar com a equipe       |
| Unidades de saúde            | Referência local, sem telefone                                      | ⚠️ `[PRECISA SER VERIFICADO]` |
| Pontos do mapa               | Posições aproximadas                                                | ⚠️ `[PRECISA SER VERIFICADO]` |

Items marcados ⚠️ **não devem ser publicados** antes da verificação com fonte oficial.

---

Feito por estudantes, sem orçamento. Prioridade: simplicidade, confiabilidade,
acessibilidade e identidade local. 🌊
