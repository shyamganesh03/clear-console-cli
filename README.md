# log-eraser-cli 1.0.3

**log-eraser-cli** is a lightweight and efficient CLI tool designed to remove `console.log` statements from your JavaScript or TypeScript projects. This helps maintain cleaner codebases and eliminates unnecessary logs, especially in production environments.

---

## Features

- Automatically scans and removes all `console.log` statements from specified files or directories.
- Supports JavaScript and TypeScript files.
- Offers an easy-to-use command-line interface.
- Configurable file extensions for targeted log removal.

---

## Folder Structure

```
|
-- src
|    |
|    |
|    -- cli
|    |    |
|    |    |
|    |    -- index.js
|    |
|    |
|    -- utils
|        |
|        |
|        -- get-root-folder.js
|        |
|        |
|        -- handle-file.js
|        |
|        |
|        -- handle-prompt
|
-- .gitignore
|
|
-- package.json

```

## Script

Add the following script to your package.json file
```
scripts: {
...
  "remove-console-log": "log-eraser-cli"
...
}

```

---

## Installation

To use `log-eraser-cli`, install it as a development dependency in your project:

```bash
npm install log-eraser-cli --save-dev
     or
yarn add log-eraser-cli --dev
```