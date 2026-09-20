# Módulos (features)

Cada pasta aqui dentro é um assunto do negócio, dono de todo o seu próprio
código: chamadas à API, cache, esquemas, componentes, testes e README.
Entender ou apagar uma funcionalidade inteira é mexer em uma pasta só.

A forma de um módulo, a fronteira entre módulos e o que fica em `src/shared`
estão em [`docs/architecture.md`](../../docs/architecture.md). O motivo da
organização está em
[`docs/decisions/0002-folders-by-business-module.md`](../../docs/decisions/0002-folders-by-business-module.md).

Regras que valem aqui: NOM-03 (outro módulo só pelo `index.ts`), NOM-04 (o nome
do arquivo começa pelo assunto), NOM-05 (só existe o arquivo que o módulo usa)
e NOM-06 (o `index.ts` exporta só o que sai do módulo).

Cada módulo tem um `README.md` com o que ele faz e as regras de negócio dele.

| Módulo | O que é |
|---|---|
| [`auth`](auth/README.md) | contrato de sessão, login e logout; fica quando o exemplo sair |
| [`items`](items/README.md) | exemplo completo, para ler, copiar e depois apagar |
