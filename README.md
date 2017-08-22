# Onefindr

## Setup
- should have node, npm and bower installed

1. `git clone <repo-url>`
2. `cd <dir-name>`
3. `npm install`
4. `bower install`

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Run
`grunt serve` to run the app locally.

## Build
`grunt build` will generate a build in the `dist` folder.

## Production Build
1- change the baseUrl and cableUrl from staging to production (commented) in `app/scripts/config.js`.
2- `grunt build` to generate the build.