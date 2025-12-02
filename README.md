# What to eat

> this is a app for help user to choose what to eat

## pre require:

1. make sure node >= 22
2. create '.env' in root dir
3. put your deepseek apiKey on var 'API_KEY'
4. put your mongoDB url on var 'DATABASE_URL'
5. run this cmd to init your database and prisma config

```bash
npm run install
npm run update:mgDB
npm run update:prisma:config
```

## 1. Dev

```bash
npm run dev
npm run dev:server
```

## 2. Product

-   ### build project

```bash
npm run build
npm run server:build
```

> front end ouput will be in './dist', server output will be in 'server/dist'

-   ### provider static resource proxy and service on port 4173

```bash
npm run server:start
```
