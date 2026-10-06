import type { HealthUnit } from '../types/healthUnit'

// Unidades de referência da região. Validar nomes, endereços, telefones e horários
// com fontes oficiais (secretarias de saúde) antes da publicação.
// [PRECISA SER VERIFICADO]
export const localHealthUnits: HealthUnit[] = [
  {
    id: 'ubs-central',
    name: 'Unidade Básica de Saúde (referência local)',
    type: 'UBS',
    address: 'Centro de Itapissuma, PE',
    phone: undefined,
    openingHours: 'Verificar com a unidade',
    latitude: -7.665,
    longitude: -34.83,
  },
  {
    id: 'usf-comunidade',
    name: 'Unidade de Saúde da Família (referência local)',
    type: 'USF',
    address: 'Itapissuma, PE',
    phone: undefined,
    openingHours: 'Verificar com a unidade',
    latitude: -7.66,
    longitude: -34.835,
  },
]
