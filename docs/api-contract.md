# Contrato de integração

Contrato de referência para o módulo de exemplo. Ajuste os serviços e esquemas ao backend real antes de adotar em produção. O template não implementa autenticação no servidor.

## Sessão

Todas as chamadas incluem cookies (`credentials: include`). Para reduzir configuração, prefira `/api/` na mesma origem, encaminhado ao backend pelo servidor de publicação. Em outra origem, o backend precisa permitir explicitamente a origem do front-end e credenciais.

| Método e caminho | Entrada | Saída |
|---|---|---|
| `GET /session` | Cookie, quando houver | 200 `{ user, csrfToken }`, inclusive anônimo com `user: null` |
| `POST /session` | `{ email, password }` e `X-CSRF-Token` | 200 `{ user, csrfToken }` e cookie de sessão |
| `DELETE /session` | Cookie e `X-CSRF-Token` | 204, invalida a sessão/cookie; idempotente |

`user`: `{ id: string, name: string, email: string, permissions: string[] }`.

- O backend cria e valida o cookie HttpOnly, Secure em HTTPS, com política SameSite adequada à implantação. Também valida o token CSRF, inclusive no login, vinculando-o à sessão anônima/autenticada, e o renova quando necessário.
- O token CSRF fica somente em memória; não é o token de autenticação. GET de sessão recupera o valor após recarga.
- Senha é enviada apenas ao endpoint de login; não é armazenada pelo front-end.
- A API autoriza cada recurso, operação e escopo de dados. A lista `permissions` pode orientar a interface de módulos futuros; não constitui segurança no cliente.
- O guard do layout verifica a sessão antes de carregar telas privadas. Falha de rede mostra erro; não é tratada como login inválido.
- Respostas 401 de recursos privados redirecionam para login e limpam o cache. Logout/login cancelam leituras em andamento e removem o cache anterior.
- Erros de login usam 401 `{ message }`. O endpoint de sessão não dispara o redirecionamento global, permitindo exibir essa mensagem.
- OIDC/SSO, MFA e renovação de sessão são decisões do backend/provedor. O módulo `auth` é o ponto de adaptação; não há refresh token inventado pelo template.

## Itens

```ts
type ItemInput = {
  name: string        // 2 a 100 caracteres após trim
  description: string // até 500 caracteres
  status: "active" | "archived"
}
type Item = ItemInput & { id: string; createdAt: string } // ISO com timezone
```

| Método e caminho | Resultado |
|---|---|
| `GET /items?q=&page=1&pageSize=10&sort=name&order=asc` | `{ items: Item[], total: number }` |
| `GET /items/:id` | `Item` |
| `POST /items` com `ItemInput` | 201 `Item` |
| `PUT /items/:id` com `ItemInput` | 200 `Item` |
| `DELETE /items/:id` | 204 |

Ordenação por `name` ou `createdAt`, direção `asc`/`desc`; tamanho da página até 100. Filtragem, ordenação e paginação ocorrem no servidor, nessa ordem. A URL da aplicação usa `pagina`, `porPagina`, `ordenarPor` e `ordem`; o serviço traduz para os nomes do contrato.

Erros: `{ message: string }`, com 401 para sessão ausente, 403 para permissão/CSRF, 404 para inexistente, 409 para conflito e 422 para validação. Mensagens retornadas precisam ser adequadas ao usuário. O cliente não mostra detalhes de exceções internas.

Não há garantias de concorrência de escrita no contrato ilustrativo. Para entidades editadas simultaneamente, acrescente versão/ETag no backend e trate o conflito 409/412 no módulo, em vez de sobrescrever silenciosamente.

## Simulação

`pnpm dev:mock` intercepta esses contratos com MSW, valida entradas e conserva dados demonstrativos no localStorage. O estado de login simulado é apenas para desenvolvimento; o build não inclui os handlers nem suas credenciais de exemplo. Os testes usam o mesmo contrato simulado e não comprovam a segurança de um backend externo.

Referência: [guards de autenticação e sua fronteira de responsabilidade](https://tanstack.com/router/latest/docs/guide/authenticated-routes).
