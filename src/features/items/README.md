# items — Cadastro de exemplo

Este módulo existe para ser lido, copiado e apagado. Ele percorre o caminho
inteiro de uma funcionalidade real: esquema Zod, serviço HTTP, consulta,
gravação, tabela ligada à URL, formulário e testes.

**Não é uma base para herdar.** Não há motor genérico de CRUD aqui
(decisão 0009): o módulo novo repete a estrutura, não importa deste.

Para remover: `docs/development.md`, "Remover o exemplo".

## Telas

| Tela | Endereço |
|---|---|
| lista, com busca, ordenação e paginação | `/items` |
| novo item | `/items/new` |
| edição e exclusão | `/items/$itemId/edit` |

- Busca, página, tamanho da página e ordenação ficam no endereço (ROT-04), com
  nomes em português traduzidos pelo serviço (IDI-03).
- A tabela sai da fábrica `useAppTable` e é ligada ao endereço por
  `bindAppTableToUrl` (CMP-05).
- Enquanto a primeira página carrega, aparece `AppTableSkeleton`; ao trocar de
  página, a anterior fica na tela (API-06).

## Regras de negócio

- **Nome é obrigatório, entre 2 e 100 caracteres**; descrição é opcional, até
  500. A regra mora em `itemInputSchema` e é a mesma no formulário e na
  conferência da resposta (FRM-01).
- **A situação é `active` ou `archived`**, sem terceira opção. Na tela ela
  aparece como "Ativo" e "Arquivado", com selo de texto — a cor sozinha não
  diz qual é (CMP-08).
- **A lista é filtrada, ordenada e paginada pelo servidor**, nessa ordem. O
  cliente não reordena o que recebeu.
- **Ordenação só por `name` ou `createdAt`**; qualquer outro valor no endereço
  cai no padrão em vez de derrubar a tela (ROT-05).
- **Excluir é excluir**: não há inativação por aqui. O item sai da lista, a
  consulta de detalhe é removida do cache e a listagem é invalidada.
- **O sucesso é anunciado depois da confirmação do servidor** (API-08); nada de
  atualização otimista neste exemplo.

## Contrato da API

`docs/api-contract.md`, seção "Itens". Enquanto não houver backend, quem
responde é a simulação em `src/mocks/handlers.ts`.
