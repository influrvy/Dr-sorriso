# Dr. Sorriso — Santa Tereza

Site institucional da clínica Dr. Sorriso integrado ao Influr Business.

## Configuração do Influr Business

Cadastre no ambiente de hospedagem as variáveis públicas abaixo, usando os valores da organização criada no Web App:

```env
NEXT_PUBLIC_INFLUR_SITE_KEY=site_key_cadastrada_no_web_app
NEXT_PUBLIC_INFLUR_ORGANIZATION=organizacao_cadastrada_no_web_app
NEXT_PUBLIC_SITE_URL=https://dominio-publicado.com.br
```

Esses valores são identificadores públicos de roteamento. Nenhuma chave secreta deve usar o prefixo `NEXT_PUBLIC_`.

Autorize no Influr Business todos os domínios que realmente servirão o site, sem barra final. Para a publicação atual:

```text
https://dr-sorriso-santa-tereza.influrvy.chatgpt.site
```

Ao conectar Vercel ou domínio próprio, autorize também a URL `https://*.vercel.app` específica do projeto e cada domínio próprio definitivo.

## Teste local

1. Copie `.env.example` para `.env.local` e preencha os identificadores públicos.
2. Instale as dependências com `pnpm install`.
3. Execute `pnpm dev` e abra `http://localhost:3000`.
4. Envie o formulário de contato e o de agendamento; confirme os novos registros na organização correta do Influr Business.
5. Teste o checkout pelo link “Quero este site” no rodapé.

O build de produção é validado com `pnpm build`.
