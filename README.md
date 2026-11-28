<p align="center">
  <img src="public/logo192.png" alt="Sliding Tiles">
</p>

# Sliding Tiles

[![release](https://img.shields.io/github/v/release/remarkablegames/sliding-tiles)](https://github.com/remarkablegames/sliding-tiles/releases)
[![build](https://github.com/remarkablegames/sliding-tiles/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/sliding-tiles/actions/workflows/build.yml)

🧩 Slide the tiles and solve the puzzle.

Play in your browser:

- [remarkablegames](https://remarkablegames.org/sliding-tiles/)

Or download for desktop:

- [Windows](https://github.com/remarkablegames/sliding-tiles/releases/latest/download/windows.zip)
- [macOS](https://github.com/remarkablegames/sliding-tiles/releases/latest/download/macos.zip)
- [Linux](https://github.com/remarkablegames/sliding-tiles/releases/latest/download/linux.zip)

## How to Play

- Choose a 3×3, 4×4, or 5×5 board.
- Click a tile beside the gap, or use the arrow keys / WASD to slide tiles.
- Solve the photo in the fastest time. Best times are saved in your browser.

Photos are loaded from [Lorem Picsum](https://picsum.photos/).

## Prerequisites

[nvm](https://github.com/nvm-sh/nvm#installing-and-updating):

```sh
brew install nvm
```

## Install

Clone the repository:

```sh
git clone https://github.com/remarkablegames/sliding-tiles.git
cd sliding-tiles
```

Install the dependencies:

```sh
npm install
```

Update the files:

- [ ] `README.md`
- [ ] `index.html`
- [ ] `package.json`
- [ ] `public/*.png`
- [ ] `public/favicon.svg`
- [ ] `public/manifest.webmanifest`
- [ ] `src/main.ts`

## Environment Variables

Update the environment variables:

```sh
cp .env .env.local
```

Update the **Secrets** in the repository **Settings**.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the game in the development mode.

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

You will also see any errors in the console.

### `npm run build`

Builds the game for production to the `dist` folder.

It correctly bundles in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your game is ready to be deployed!

### `npm run bundle`

Builds the game and compresses the contents into a ZIP archive in the `dist` folder.

Your game can be uploaded to your server, [itch.io](https://itch.io/), etc.

## Testing

Append `?win` to the URL to show the win overlay:

```
http://localhost:5173/?win
```

## License

[MIT](LICENSE)
