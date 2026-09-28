# APIS — Word Order

Atividade interativa para praticar a ordem das palavras em inglês. Feita com HTML, CSS e JavaScript, sem frameworks ou etapa de build.

**[Abrir atividade](https://vidigal-code.github.io/apis-design-word-order/)**

## Como usar

1. Escolha as peças para montar a frase.
2. Use as setas para mudar a ordem ou selecione uma peça da resposta para removê-la.
3. Confira a resposta e avance para a próxima frase.

A atividade tem cinco frases, dicas, progresso e opção de jogar novamente. A interface está disponível em português, inglês e espanhol. É possível ouvir as dicas e a pronúncia em inglês, além de ativar ou desligar os efeitos sonoros.

Use **Tab** para navegar e **Enter** ou **Espaço** para selecionar. A leitura em voz alta depende das vozes disponíveis no navegador e no sistema.

## Executar localmente

Na pasta do projeto:

```sh
python -m http.server 8000
```

Acesse [localhost:8000](http://localhost:8000). Use um servidor HTTP para carregar os módulos JavaScript.

## Estrutura

- `index.html`: estrutura da página.
- `styles/`: estilos organizados por responsabilidade.
- `src/`: conteúdo, idiomas e interações.
- `assets/`: favicon SVG.

## Publicação

O GitHub Actions publica o site no GitHub Pages a cada atualização da branch `main`. O workflow está em `.github/workflows/pages.yml`.
