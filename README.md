# Commit Newer/Older Indicators

A tiny browser extension that adds simple visual indicators to commit lists so you instantly know which side is newer and which is older.

- On GitHub Pull Request (https://github.com): places "Older" at the top and "Newer" at the bottom.
- On JetBrains Space Code Review (https://code.jetbrains.team/, https://jetbrains.team/): places "Newer" at the top and "Older" at the bottom.

## Installation from stores

- Google Chrome: https://chromewebstore.google.com/detail/commit-newerolder-indicat/cipaocmjgedcaoapochhaofpbcaadgcf
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/commit-newer-older-indicators/

## Installation from sources

**Firefox**

Unfortunately, humans no longer own their computers.
Firefox doesn't allow persistent installations of unsigned plugins for release versions of Firefox.
Shame on you, Firefox.

`about:addons` -> Gear icon -> Debug Add-ons -> Load Temporary Add-on... -> Choose `./manifest.json` in the file picker.
The extension is installed until the browser is restarted.

**Google Chrome**

`chrome://extensions/` -> Load unpacked -> Choose the root directory of the project in the file picker.

## Motivation

Because it's different every time on every web site and git CLI.

## Code quality

I don't care, vibe-coded with Junie

## Screenshots

### Space

<img src="./screenshots/space.png" width="60%">

### GitHub

<img src="./screenshots/github.png" width="80%">
