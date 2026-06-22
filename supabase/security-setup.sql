-- ============================================================
-- Intuir Yoga — Correções críticas de segurança (rodar uma vez)
-- Execute este script completo no Supabase: Dashboard > SQL Editor > New query > Run
-- ============================================================

-- 1) Habilita Row Level Security nas tabelas
alter table public.aulas enable row level security;
alter table public.reservas enable row level security;

-- 2) Políticas para a tabela "aulas"
-- Qualquer pessoa (mesmo sem login) pode ler aulas ativas — usado pela página pública /aulas
drop policy if exists "aulas_select_publico" on public.aulas;
create policy "aulas_select_publico"
  on public.aulas for select
  to anon
  using (ativa = true);

-- Usuário autenticado (admin) pode ler, criar, editar e excluir qualquer aula
drop policy if exists "aulas_admin_full" on public.aulas;
create policy "aulas_admin_full"
  on public.aulas for all
  to authenticated
  using (true)
  with check (true);

-- 3) Políticas para a tabela "reservas"
-- Nenhum acesso anônimo — clientes nunca leem reservas direto, só via API com service role
-- Usuário autenticado (admin) pode ler todas as reservas (painel "ver alunos")
drop policy if exists "reservas_admin_select" on public.reservas;
create policy "reservas_admin_select"
  on public.reservas for select
  to authenticated
  using (true);

-- 4) Função para decrementar vaga de forma atômica (evita overbooking por corrida)
-- Remove a versão antiga (uuid) caso tenha sido criada antes
drop function if exists public.decrementar_vaga(uuid);

create or replace function public.decrementar_vaga(p_aula_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.aulas
  set vagas_disponiveis = vagas_disponiveis - 1
  where id::text = p_aula_id and vagas_disponiveis > 0;
end;
$$;

-- Permite que o service role (usado no webhook) chame essa função
grant execute on function public.decrementar_vaga(text) to service_role;
