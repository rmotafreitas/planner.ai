Requirements:

- Node 18.9.0 or higher
- npm 6.14.15 or higher
- pnpm

Install pnpm globally:

```bash
npm install -g pnpm
```

Install dependencies:

You should install the dependencies using pnpm for the backend and npm for the frontend.

backend folder: server

```bash
pnpm install
```

frontend folder: client

```bash
npm install
```

After installing the dependencies, you need to create a .env file in the server folder and in the client folder. You can use the .env.example file as a template, in both folders.

There are a lot of api keys and other sensitive information that you need to fill in the .env file.
Useful links:

https://outlook.office.com/owa/

https://developers.amadeus.com/

https://api.weatherapi.com/

https://www.hanko.io/

https://unsplash.com/developers

https://openai.com/

> Small note for openai: You need to have creedits in your account to use the api.

In the server folder, you need to run the following command to create the prisma client:

```bash
pnpx prisma generate
```

Now after all the setup is done, you can run the server and the client.

In the server folder, run:

```bash
pnpm run dev
```

In the client folder, run:

```bash
npm run dev
```
