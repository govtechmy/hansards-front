# hansards-front

_WIP_

---

## Table of Contents

- [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Commands to Know](#commands-to-know)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

## Installation

We recommend to use `yarn` to manage the project's dependencies.

```sh
git clone git@github.com:govtech-malaysia/hansards-front.git

# Yarn
yarn install
yarn prepare

# NPM
npm install
npx prepare

cp .env.example .env
```

### Environment Variables

The following are the environment variables (.env) used for hansard.parlimen.gov.my. Please take note, there are only 2 variables required to get the app running, both of which are related to the [Backend](https://github.com/govtech-malaysia/hansards-back).

| Variables           | Required | Default                             | Description                              |
| ------------------- | -------- | ----------------------------------- | ---------------------------------------- |
| APP_URL             | ⬜️       | http://localhost:3000 (development) | App domain. Optional                     |
| API_URL             | ✅       | http://localhost:8000 (development) | Back-end URL                             |
| AUTHORIZATION_TOKEN | ✅       | _Create own_                        | Authorization token for BE communication |

## Commands to Know

```bash
# Start development server
yarn dev

# Build production app
yarn build

# Start production server
yarn start

# Setup husky for githook
yarn prepare
```

## Development Workflow

1. Branch out from `staging` & give the new branch a descriptive name eg: `feat/hansard`, `fix/dropdown-bug` etc.
2. After you're done developing, `git fetch && git merge origin/staging` to synchronize any new changes & resolve conflicts, if there is any.
3. Push the branch to remote and create a PR to `staging`. Briefly describe the changes introduced in the PR.
4. Assign a core developer to review and wait for it to be approved.
5. That's all. Happy developing!

## Contributing

Thank you for your willingness to contribute to this free and open source project by the Malaysian public sector! When contributing, consider first discussing your desired change with the core team via GitHub issues or discussions!

## License

hansard.parlimen.gov.my is licensed under [MIT](./LICENSE.md)

Copyright © 2023 Parliament of Malaysia
