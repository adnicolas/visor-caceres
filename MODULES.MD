# Instalación de módulos locales

Podemos disponer de módulos locales en la aplicación provenientes de otros desarrolladores. Estos módulos pueden ser submódulos de GIT donde hemos hecho checkout de un tag concreto.

Para añadirlos a nuestro proyecto, añadimos el submódulo git de la forma habitual a una carpeta de nuestro proyecto y haremos checkout del tag requerido.

EL módulo a incorporar debe tener unas características mínimas:
1. Debe disponer de un archivo package.json
2. Debe tener declaradas sus dependencias

## Generar archivo package.json
Para generar el package.json en la carpeta raiz del módulo ejecutaremos el comando para inicializar npm:
    
`npm init`
Este comando nos irá preguntando las diferentes propiedes mínimas para generar el package

## Instalar dependencias
Desde la carpeta raiz del proyecto, instalar las dependencias necesarias con el modificador --save para que queden guardadas en nuestro package.

P. ej.: `npm install @auth0/angular-jwt --save`

## Instalar nuestro módulo local
Con nuestro módulo local preparado, lo instalamos en nuestro proyecto, en nuestro caso el módulo se llama users y está ubicado en src/app/modules/users.

`npm install  --save ./src/app/modules/users`



