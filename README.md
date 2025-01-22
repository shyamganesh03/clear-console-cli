# clear-log-cli 1.0.0

**clear-log-cli** is a lightweight and efficient CLI tool designed to remove `console.log` statements from your JavaScript or TypeScript projects. This helps maintain cleaner codebases and eliminates unnecessary logs, especially in production environments.


![remove-console-log](https://github.com/user-attachments/assets/99595024-f0bb-4560-be34-079c04c78aab)

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
  "remove-console-log": "clear-log-cli"
...
}

```

---

## Installation

To use `clear-log-cli`, install it as a development dependency in your project:

```bash
npm install clear-log-cli --save-dev
     or
yarn add clear-log-cli --dev
```
