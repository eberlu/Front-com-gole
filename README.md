# Front-com-gole
Layout e estrutura front-end para gerar templates web (HTML/CSS/JS).

## Comandos

Buildar: ```yarn gulp```

Dev server: ```yarn dev```


## Sobre a estrutura

### Views

O template engine escolhido foi o [Twig](https://twig.symfony.com/), o arquivo ```src/_layout.twig``` contém alguns snippets úteis para montar o "sanduíche" de seu html.

### Styles

A responsabilidade dos estilos fica a encargo do SASS, utilizando o compilador dart-sass por padrão.

### Scripts

O bundle dos scripts é gerado através do webpack, aceitando múltiplos pontos de entrada além do padrão```src/js/main.js``` se necessário.

Os pontos de entrada são indicados no arquivo ```config.js```
```
module.exports = {
    jsFiles: {
        main: './src/js/main.js',
    }
}
```
## Observações
- No comando build estão acontecendo algumas excessões, isso é comum ao gerar build sequenciais e é referente a pasta ```dist```, caso aconteça basta deletar a mesma e rodar o comando novamente.
