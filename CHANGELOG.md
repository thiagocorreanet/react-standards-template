# Changelog

## Não lançado

- MCP do shadcn configurado por projeto em `.mcp.json`, incluído nas cópias
  geradas.
- Regras do projeto em Markdown: `CLAUDE.md` com comandos, ordem de leitura e as
  regras que quebram em silêncio.
- `docs/standards.md` com 79 regras codificadas (NOM, COD, IDI, CMP, COR, ROT,
  API, EST, FRM, FMT, SEG, AMB, FER, TST), cada uma com nível e motivo.
- `docs/decisions/` com as nove decisões que sustentam essas regras, e
  `docs/README.md` como índice da documentação.
- `README.md` por módulo em `src/features/`, com as regras de negócio.
- Skill `app-review-standards` para Claude Code: revisa o código contra as
  regras e devolve relatório; só relata, não corrige.
- CMP-02 passa a ser obrigatória e detectada pela varredura: elemento nativo
  com primitiva instalada em `ui/` é defeito. O formulário de exemplo trocou o
  `<select>` nativo pelo `Select` do shadcn.
- O gerador de projetos passa a copiar `CLAUDE.md`, `.claude/` e `.mcp.json`.
- O gerador virou o comando global `criar-app`, registrado por um symlink em
  `~/.local/bin`, e passou a instalar as dependências e iniciar o git com o
  primeiro commit. `--no-install` e `--no-git` desligam cada passo.

## 0.1.0 — 2026-09-20

- Base React/TypeScript com Vite, TanStack Router/Query/Form/Table e shadcn/Base UI.
- Layout responsivo e identidade, tema, navegação e formatação configuráveis.
- Sessão por contrato HTTP, CSRF, login/logout e limpeza de cache.
- CRUD de referência com filtros na URL e paginação no servidor.
- MSW em desenvolvimento, testes de integração/componente e jornadas Playwright.
- CI, documentação e comando de criação de projetos independentes.
