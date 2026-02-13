# Infoeste Blog API

API para estudo de testes de API, desenvolvida para o **INFOESTE** – circuito de palestras de estudantes universitários sobre tecnologias, na **FIPP/UNOESTE** (Presidente Prudente, São Paulo, Brasil).

Este projeto foi usado em uma palestra sobre Postman e Newman CLI, quando fazia parte do **Postman Student Expert Program**.

## Executando a API localmente

1. Execute `pnpm install`
2. Execute `pnpm start`

Documentação disponível em:

```
http://localhost:3000/docs
```

## Executando os testes com Postman CLI

```bash
# Com a collection do CI (mesma usada no Newman)
postman collection run "ci-local-newman.postman_collection.json" \
  --env-var baseUrl=http://localhost:3000 \
  -r cli,html
```

## Executando os testes com Newman

O workflow de Newman usa a collection hospedada no Postman Cloud. Para rodar localmente com a mesma collection:

```bash
# Baixar a collection do CI (requer POSTMAN_API_KEY)
POSTMAN_API_KEY=your_key ./scripts/fetch-postman-collection.sh

# Rodar com Newman
newman run ci-local-newman.postman_collection.json \
  --env-var baseUrl=http://localhost:3000
```

Ou usando a URL diretamente (com API key):

```bash
newman run "https://api.getpostman.com/collections/2484339-33cb760a-1427-4a7d-aac6-369b4ba79fcc?apikey=<API_KEY>" \
  --environment "https://api.getpostman.com/environments/2484339-ad3b35d5-37c3-4881-ae79-91dfbd78d68a?apikey=<API_KEY>"
```

> **Nota:** `ci-local-newman.postman_collection.json` é a collection usada no CI (Postman CLI e Newman).  
> `Infoeste Blog API.postman_collection.json` é uma versão local alternativa.

## CI/CD – GitHub Actions

O projeto possui dois workflows de CI:

| Workflow | Descrição |
|----------|-----------|
| **Newman** (`ci-newman.yml`) | Abordagem original, usada quando o Postman CLI ainda não estava disponível para CI |
| **Postman CLI** (`ci-postman-cli.yml`) | Abordagem atual, usando o Postman CLI nativo em CI |

Ambos rodam em push nas branches `master` e `staging`.

### Evolução do projeto

Inicialmente, era possível rodar o Postman CLI apenas na máquina local. Por isso, foi desenvolvida uma solução com **Newman** para executar a collection no CI. Com a disponibilidade do **Postman CLI em CI**, o projeto foi atualizado e a abordagem com Postman CLI foi incorporada à palestra e ao workflow do GitHub Actions.

---

*Postman Student Expert Program • INFOESTE / FIPP-UNOESTE*
