-- Vozes da Maré — carga inicial de espécies.
-- Textos educativos e curtos. Antes de publicar, a equipe deve revisar cada
-- espécie e habitat com fonte local verificável. [PRECISA SER VERIFICADO]

insert into public.fish (name, scientific_name, description, habitat, fishing_information)
values
  ('Carapicu', 'Diapterus olisthostomus',
   'Peixe prateado comum em áreas costeiras e estuarinas.',
   'Estuários e manguezais',
   'Pesca artesanal, comum em redes de espera.'),
  ('Tainha', 'Mugil spp.',
   'Peixe de cardume que entra em estuários na maré.',
   'Manguezais e canais',
   'Pesca artesanal com tarrafa e rede.'),
  ('Camurim', 'Megalops atlanticus',
   'Peixe de grande porte, também chamado de carapeba.',
   'Estuários e águas rasas costeiras',
   'Pesca esportiva e artesanal, com linha e anzol.'),
  ('Barracuda', 'Sphyraena barracuda',
   'Peixe alongado de águas claras, predador rápido.',
   'Águas costeiras e estuários',
   'Capturado com linha, anzol e isca artificial.'),
  ('Robalo', 'Centropomus undecimalis',
   'Peixe valorizado, vive entre o mar e os estuários.',
   'Estuários e lagunas costeiras',
   'Pesca artesanal com rede de espera e linha.')
on conflict do nothing;

-- As unidades de saúde só entram depois de confirmadas pela equipe.
-- Telefone e horário nunca são preenchidos "de memória".
-- [PRECISA SER VERIFICADO]
--
-- insert into public.health_units (name, type, address, phone, latitude, longitude, opening_hours)
-- values ('Nome oficial da unidade', 'UBS', 'Endereço completo', '(00) 00000-0000', -7.665, -34.83, 'Seg a Sex, 07h às 17h');