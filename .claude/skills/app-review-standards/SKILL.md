---
name: app-review-standards
description: Revisa código implementado neste template React contra os padrões do repositório — arquitetura, organização de arquivos, padrão de codificação, overengineering, idioma, sessão e autorização, testes e documentação desatualizada. Use ao terminar uma implementação ou quando pedirem revisão de padrões. Só relata; não corrige nada. Argumento opcional — pastas, arquivos ou intervalo de commits; sem argumento, revisa o que ainda não foi commitado.
argument-hint: "[pastas | arquivos | commit..commit]"
context: fork
agent: general-purpose
allowed-tools: Read, Grep, Glob, Bash(git *), Bash(node ${CLAUDE_SKILL_DIR}/scripts/*)
---

# Revisão de padrões do react-app-template

Você revisa o repositório **como ele está hoje**: o código do escopo, a
documentação atual e as convenções dela.

Não altere nenhum arquivo. O produto é um relatório.

## Já executado antes de você começar

!`node ${CLAUDE_SKILL_DIR}/scripts/checks.mjs`

### Varredura do que não foi commitado

!`node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs`

Argumento recebido: `$ARGUMENTS`

## Passo 1 — Escopo

- Argumento vazio: use a varredura acima.
- Com argumento: rode `node ${CLAUDE_SKILL_DIR}/scripts/scan.mjs $ARGUMENTS` e
  use essa varredura no lugar da de cima.

A varredura traz: arquivos do escopo, suspeitas por busca, referências a
arquivos apagados, documentação com referência quebrada e o comando que lê as
seções de regras que o escopo toca.

## Passo 2 — Leia tudo numa leva só

Numa única resposta, com chamadas em paralelo:

- o comando de regras indicado na varredura;
- `docs/architecture.md`;
- cada arquivo do escopo que não foi apagado, inteiro;
- o `README.md` dos módulos tocados;
- `docs/api-contract.md`, se o escopo tocar sessão, permissão ou endpoint;
- `docs/README.md`, se o escopo tiver documentação.

Outra seção de `docs/standards.md` ou `docs/decisions/` só se um achado
depender dela.

## Passo 3 — Confirme as suspeitas

- Cada suspeita é candidata, não achado. Confirme contra a regra e o arquivo
  lido; descarte falso positivo sem mencionar.
- O que a verificação automática cobre (Biome, TypeScript, testes) não se
  confere à mão.
- `src/shared/components/ui/` é gerado pelo shadcn: aponte só que foi editado
  (CMP-01), nunca o estilo do que está lá dentro.
- Aponte só o que a mudança introduziu ou tocou.

## Passo 4 — Julgamento

- **Lugar de cada coisa:** módulo certo? Subiu para `src/shared` sem segundo
  módulo usando? `index.ts` virou índice de tudo? Pasta ou tipo de arquivo que
  `architecture.md` não prevê? `src/shared` importando de `src/features`?
- **Estado:** cada estado no dono da tabela EST-03? Dado da API copiado para
  `useState` ou contexto? Filtro fora da URL?
- **Sessão:** guarda tratada como autorização? Algo de sessão guardado no
  navegador? Permissão usada como segurança?
- **Overengineering:** abstração de uso único; propriedade, variante ou ramo
  que ninguém usa; arquivo "para o futuro"; `lib/` virando gaveta; camada que
  só repassa. Este é um template — a pressão para generalizar é maior aqui, e a
  decisão 0009 diz não.
- **Código:** nomes dizem o que a coisa é? Peça visual veio do shadcn? Medida
  fora da escala virou token? Cor sozinha carrega significado? Controle tem
  nome acessível? Texto de tela em português e código em inglês?
- **Testes:** falta teste do que quebraria em silêncio? Sobra teste do que não
  merece? Jornada de navegador para algo que cabia no Vitest?
- **Documentação:** pasta, componente, regra ou armadilha nova registrada?
  Mudança que contraria `docs/decisions/` sem registro novo? Mudança que afeta
  quem já copiou o template e não entrou no `CHANGELOG.md`? Arquivo novo na
  raiz que precisa entrar em `scripts/create-project.mjs`?

Regras de trabalho:

- Agrupe buscas independentes numa mesma resposta.
- Antes de dizer que algo não é usado, faça uma busca no projeto inteiro.
- Experimento (rodar uma ferramenta para confirmar suspeita) só com suspeita
  concreta, no máximo um, sem gravar arquivo no projeto.

## Passo 5 — Relatório

Em português, para quem valida regras mas não escreve o código:

- Regra sempre com código e título ("API-02 — Toda resposta da API é conferida
  pelo Zod"). O achado diz em palavras o que o trecho faz; `arquivo.tsx:42` só
  no fim, como referência.
- Traduza termo técnico na primeira aparição.
- Sem elogio, sem resumo do código, sem achado para preencher seção. Seção
  vazia some.

```markdown
# Revisão de padrões — <escopo em uma frase>

**Resultado:** <N> bloqueiam · <N> deveriam ser corrigidos · <N> sugestões

## Verificação automática
- Estilo e imports (pnpm check): passou | <falhas>
- Tipos (pnpm typecheck): passou | <falhas>
- Testes (pnpm test): <N> passaram | <falhas>

## Bloqueia
### <título curto>
<O que acontece e por que fere a regra, em 2 a 4 frases.>
**Regra:** <CÓDIGO> — <título> (nível <DEVE | NÃO DEVE | DEVERIA>)
**Sugestão:** <o conserto em uma ou duas frases>
<sub>`caminho/arquivo.tsx:linha`</sub>

## Deveria corrigir
## Sugestões
## Documentação desatualizada
## Perguntas
<quando código e documentação discordam e não dá para saber qual vale>
```

Níveis:

- **Bloqueia:** quebra uma regra de "Regras que quebram em silêncio" do
  `CLAUDE.md`, ou a verificação automática falhou.
- **Deveria corrigir:** descumpre outra regra DEVE ou NÃO DEVE, ou DEVERIA sem
  motivo aparente.
- **Sugestão:** julgamento sem regra escrita, ou DEVERIA com motivo plausível.

Na dúvida entre dois níveis, escolha o menor e diga por quê. Achado sem regra
escrita é no máximo sugestão; se merecer regra, diga.

Termine no relatório. Não ofereça nem aplique correções.
