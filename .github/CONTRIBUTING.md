# Contribuir

Este repositório é um template: o que entra aqui nasce de novo em cada projeto
gerado com `criar-app`. Mudança pequena custa pouco de revisar; mudança de
regra custa caro em todos os projetos que já copiaram o template. Por isso as
duas seguem caminhos diferentes.

## Rodar

Requisitos: Node 24 e pnpm 10.33.0.

```bash
pnpm install --frozen-lockfile
pnpm dev:mock
```

Antes de abrir a PR:

```bash
pnpm verify
```

`verify` roda Biome, TypeScript, os testes, o teste do gerador e o build.
Mexeu em sessão, navegação ou gravação? Rode também `pnpm test:e2e`, que
precisa da porta 4300 livre.

## Mudar código

Leia a seção correspondente de `docs/standards.md` antes de escrever. As
regras que quebram em silêncio estão listadas no `CLAUDE.md`: são as que não
dão erro quando descumpridas, e quebrar qualquer uma bloqueia a revisão.

Regra tem código para ser citada. Na revisão, "API-02 — Toda resposta da API é
conferida pelo Zod" localiza a regra, o motivo e a consequência sem depender
da memória de quem revisa.

Mudou algo que a documentação descreve? Atualize no mesmo trabalho.

## Mudar uma regra

Regra nova entra em `docs/standards.md` com código, nível e motivo. Regra
grande, daquelas que mudam como o projeto inteiro é escrito, ganha um arquivo
em `docs/decisions/`, numerado, dizendo o que foi decidido e o que foi
descartado junto.

Discordar de uma regra que já existe começa pelo arquivo de decisão dela, não
pelo código que a descumpre.

## O que o CI cobra

| Workflow | Quando | O que responde |
|---|---|---|
| `Quality` | toda PR e todo push em `main` | Biome, tipos, testes, build e a jornada no navegador. `verify` é o check que resume os outros |
| `Generator round trip` | quando o gerador ou o empacotamento muda | o projeto gerado instala, passa nas conferências e tem commit inicial |
| `Node next compatibility` | segunda de manhã | a próxima versão do Node quebra o template |

PR que só mexe em texto pula os jobs de código; o `verify` continua rodando e
é ele que a proteção de branch deve exigir.

## Commits

Assunto no imperativo, em português, dizendo o efeito. O corpo explica o
porquê quando o diff não explica sozinho.
