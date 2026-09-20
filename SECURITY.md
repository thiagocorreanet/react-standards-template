# Política de segurança

Este arquivo fica na raiz, e não em `.github/`, de propósito: a pasta
`.github` inteira é copiada para cada projeto gerado pelo `criar-app`, e um
sistema interno de outra empresa não deve mandar relatar vulnerabilidade aqui.

## Versões suportadas

O template não tem versões mantidas em paralelo. Vale o que está em `main`.
Cópias geradas são independentes desde o primeiro commit e não recebem
correção automática daqui; quem gerou o projeto é quem corrige.

## Como relatar

Use o relato privado de vulnerabilidade do GitHub, em **Security → Report a
vulnerability** neste repositório. Ele cria uma conversa privada e não expõe a
falha antes de existir correção.

Não abra issue pública para falha de segurança. Issue é o lugar certo para
todo o resto.

Diga o que dá para fazer com a falha, não só o que está errado, e como
reproduzir. Respondo em até uma semana; sem resposta nesse prazo, cobre na
mesma conversa.

## O que está no escopo

- O código de sessão e autenticação em `src/features/auth/`, incluindo o
  tratamento do cookie e do token CSRF.
- O gerador `scripts/create-project.mjs`, que escreve arquivos e roda comandos
  na máquina de quem o usa.
- A garantia de que o modo de simulação fica fora do build de produção, que é
  o que `scripts/check-build.mjs` confere.
- Os workflows em `.github/workflows/`, que rodam com o `GITHUB_TOKEN` do
  repositório.

## O que está fora do escopo

- O backend. A API é separada, não está neste repositório, e o contrato em
  `docs/api-contract.md` descreve o que ela precisa implementar. Quem autoriza
  é a API (SEG-02); a guarda de rota no front é conveniência.
- As credenciais `demo@example.com` / `demo12345`. São dados de demonstração
  do modo simulado, não existem em produção, e o build falha se vazarem para
  `dist/`.
- Variáveis `VITE_*`. São públicas por definição e substituídas no build;
  colocar segredo ali é erro de uso, não falha do template (AMB-01).
- Vulnerabilidade em dependência sem caminho de exploração neste código. Os
  alertas do Dependabot já cobrem esse caso e viram PR.
