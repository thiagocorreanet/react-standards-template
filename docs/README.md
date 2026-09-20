# Documentação do template

| Documento | O que cobre | Quando ler |
|---|---|---|
| [`architecture.md`](architecture.md) | pastas, forma do módulo, fronteira entre módulos, fluxo de dados | antes de criar, mover ou apagar arquivo |
| [`standards.md`](standards.md) | regras de escrita, com código, nível e motivo | antes de escrever ou revisar código |
| [`api-contract.md`](api-contract.md) | sessão, CSRF, permissões e endpoints do exemplo | antes de mexer em login, autorização ou chamada à API |
| [`development.md`](development.md) | criar funcionalidade, remover o exemplo, testar, atualizar dependências | ao começar ou apagar um módulo |
| [`decisions/`](decisions/) | uma decisão grande por arquivo: contexto, decisão, consequências | quando uma regra parecer estranha; antes de mudar uma decisão |

## Como manter

- Documentação muda no mesmo commit do código.
- Uma informação, um lugar; os outros documentos apontam para ele.
- Texto curto, em tópicos, linguagem direta.
- Regra nova: próximo código livre da seção em `standards.md`. Regra que deixa
  de valer é apagada; o código não é reaproveitado.
- Decisão nova: `decisions/NNNN-nome-em-ingles.md`, no formato das existentes.
  Decisão revertida é marcada substituída, nunca apagada.
- Nome de arquivo em inglês; conteúdo em português.
- Mudança que afeta quem já copiou o template entra no `CHANGELOG.md`.

Fora desta pasta: `CLAUDE.md` (o que ler antes de agir e as regras que quebram
em silêncio), `README.md` (rodar, gerar projeto e publicar),
`src/features/README.md` (o que é um módulo) e
`src/features/<módulo>/README.md` (regras de negócio do módulo).
