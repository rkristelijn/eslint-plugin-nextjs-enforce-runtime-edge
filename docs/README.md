# Testing locally

Needs: Node 22

- `git clone git@github.com:rkristelijn/eslint-plugin-nextjs-enforce-runtime-edge.git && cd eslint-plugin-nextjs-enforce-runtime-edge`
- `npm i` - install dependencies
- `npm run test` - not working yet

you can link the project and test inside your own project

- `npm link` run inside of this project to make this project available for linking
- `npm link eslint-plugin-nextjs-enforce-runtime-edge` run this in the client project
- `npm ls --global | grep eslint-plugin-nextjs-enforce-runtime-edge` - check if the link was successfull
- configure the plugin in your client project like in [main README.md](../README.md)

cleaning up:
- `npm unlink --global eslint-plugin-nextjs-enforce-runtime-edge`
- `npm ls --global | grep eslint-plugin-nextjs-enforce-runtime-edge` - check if the unlink was successfull