create table if not exists mentoria_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  nome text,
  email text,
  whatsapp text,
  instagram text,
  o_que_faz text,
  tempo_trabalho text,
  tamanho_empresa text,
  tamanho_time text,
  ia_dia_a_dia text,
  maturidade_ia text,
  ferramentas_ia text,
  travamentos text,
  o_que_vende text,
  problema_30_dias text,
  sucesso_8_semanas text,
  motivo_mentoria text,
  info_adicional text
);

alter table mentoria_submissions enable row level security;

create policy "allow_insert" on mentoria_submissions
  for insert to anon with check (true);

create policy "allow_select" on mentoria_submissions
  for select to anon using (true);

create policy "allow_delete" on mentoria_submissions
  for delete to anon using (true);
