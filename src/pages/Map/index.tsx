import type { FC } from 'react'
import Tela from '../../components/Tela'
import Topo from '../../components/Topo'
import MapView from '../../components/Map/MapView'

/** Mapa de Itapissuma (§11). Leaflet + OpenStreetMap, sem chave e sem custo. */
const MapaPage: FC = () => (
  <Tela semOndas>
    <Topo titulo="Mapa de Itapissuma" />
    <div className="mx-auto max-w-lg px-4 pt-4">
      <MapView />
    </div>
  </Tela>
)

export default MapaPage
