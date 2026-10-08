# LinkUp

A small app built with Vinext and Vite.

This project is ready to run locally, but it does need one thing installed first: Node.js.

If you are not familiar with Node.js, don't worry. You do not need to write code or understand the backend. You only need to install the software and run a few commands in your terminal.

## What you need

Install Node.js LTS from the official website:

https://nodejs.org/

Choose the LTS version (the recommended version). After installation, restart your terminal if needed.

## Check that Node is installed

Open a terminal in this project folder and run:

```bash
node -v
npm -v
```

If both commands print a version number, Node.js is installed correctly.

## 1) Open a terminal in the project folder

On Windows, use PowerShell or Command Prompt.
On Mac or Linux, use the Terminal app.

Navigate to the project folder:

```bash
cd path/to/linkup
```

For example:

```bash
cd ~/Desktop/hackathon/linkup
```

## 2) Install project dependencies

Run:

```bash
npm install
```

This installs everything the app needs to run.

## 3) Start the app

Run:

```bash
npm run dev -- --host 0.0.0.0
```

Then open this in your browser:

http://localhost:5173/

You should see the app running locally.

To stop the app, press:

```bash
Ctrl + C
```

## 4) Build the app for production

If you want to create a production build, run:

```bash
npm run build
```

This creates the files needed to deploy the app.

## Useful scripts

```bash
npm run dev -- --host 0.0.0.0
npm run build
npm run start
npm run deploy
```

- `npm run dev -- --host 0.0.0.0` starts the local development app
- `npm run build` creates a production build
- `npm run start` runs the built app locally with Wrangler
- `npm run deploy` deploys the project

## If something does not work

1. Make sure Node.js is installed and working
2. Run `npm install` again
3. Close and reopen the terminal
4. Make sure you are in the project folder
5. If the error mentions missing packages, run:

```bash
npm install
```

## Quick start summary

```bash
cd path/to/linkup
npm install
npm run dev -- --host 0.0.0.0
```

Then visit:

http://localhost:5173/

This app was verified locally and starts successfully using the commands above.

