import { Suspense, lazy, useEffect, useState, type FC } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Abertura from './pages/Abertura'

/* Rotas carregadas sob demanda: o primeiro carregamento fica leve em 3G,
   que é a conexão real de muita gente na periferia (§28 custo zero). */
const Home = lazy(() => import('./pages/Home'))
const Clima = lazy(() => import('./pages/Weather'))
const Mare = lazy(() => import('./pages/Tide'))
const MapaPage = lazy(() => import('./pages/Map'))
const Peixes = lazy(() => import('./pages/Fish'))
const Riscos = lazy(() => import('./pages/Risks'))
const Saude = lazy(() => import('./pages/Health'))
const VoiceAssistant = lazy(() => import('./pages/VoiceAssistant'))

const CHAVE_ABERTURA = 'vozes-da-mare:abriu'

/** Tela de carregamento entre rotas — nunca mostra uma página em branco. */
const Carregando: FC = () => (
  <div
    className="flex min-h-dvh items-center justify-center bg-areia-100"
    role="status"
    aria-live="polite"
  >
    <div className="flex flex-col items-center gap-3">
      <div className="h-12 w-12 animate-pulse rounded-full bg-mare-200" />
      <p className="text-[13px] font-semibold text-tinta-suave">Carregando…</p>
    </div>
  </div>
)

const Shell: FC = () => {
  /* Splash só na primeira abertura do navegador; depois vai direto ao Início. */
  const [abriu, setAbriu] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(CHAVE_ABERTURA)
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (abriu) return
    try {
      localStorage.setItem(CHAVE_ABERTURA, 'sim')
    } catch {
      /* modo privativo: sem armazenamento, apenas não lembramos da abertura */
    }
  }, [abriu])

  if (abriu) return <Abertura onEntrar={() => setAbriu(false)} />

  return (
    <div className="min-h-dvh bg-areia-100">
      <Suspense fallback={<Carregando />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clima" element={<Clima />} />
          <Route path="/mare" element={<Mare />} />
          <Route path="/mapa" element={<MapaPage />} />
          <Route path="/peixes" element={<Peixes />} />
          <Route path="/riscos" element={<Riscos />} />
          <Route path="/saude" element={<Saude />} />
          <Route path="/voz" element={<VoiceAssistant />} />
          {/* URLs antigas em inglês, caso alguém já tenha o app aberto */}
          <Route path="/weather" element={<Navigate to="/clima" replace />} />
          <Route path="/tide" element={<Navigate to="/mare" replace />} />
          <Route path="/map" element={<Navigate to="/mapa" replace />} />
          <Route path="/fish" element={<Navigate to="/peixes" replace />} />
          <Route path="/health" element={<Navigate to="/saude" replace />} />
          <Route path="/voice" element={<Navigate to="/voz" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <BottomNav />
    </div>
  )
}

const App: FC = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Shell />
  </BrowserRouter>
)

export default App
