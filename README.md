<div align="center">

<!--- FIXME: chnage below to name of your project! --->

# `GSUBZ NodeJS SDK`

<!--- FIXME: Write short catchy description/tagline of project --->

## Introduction

This SDK provides a simple and efficient access to the GSUBZ API, allowing you to check balance, retrieve service, plans, make payments, and verify payments. This guide will walk you through the installation, setup, and usage of the package to help you integrate it seamlessly into your application.

</div>

## Table of Content

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Setup](#setup)
4. [Usage](#usage)
5. [Development](#development)
6. [Contributing](#contributing)
7. [License](#license)

## Requirements

- GSUBZ API Key.
- Node JS v18 or higher.

## Installation

```sh
npm install @specialman/gsubz
```

## Setup

```javascript
let gsubz = require("@specialman/gsubz");
gsubz = gsubz("your_api_key");
```

# Usage

[Usage Guide](documentation/usage.md)

## Development

- [Development guide](AGENT.md): repository structure, standards, tests, and release rules.
- [Contributor guide](CONTRIBUTING.md): how to propose changes and open pull requests.
- [Changelog](CHANGELOG.md): released and unreleased changes.

Run `npm run setup-hooks` once to enable the versioned local hooks. Run `npm run verify` before pushing.

## Contributing

We welcome community contributions to this project.

Please read our [Contributor Guide](CONTRIBUTING.md) for more information on how to get started.
Please also read our [Contributor Terms](CONTRIBUTING.md#contributor-terms) before you make any contributions.

### License

By contributing to this project, you agree that your contributions will be licensed under its [MIT license](/LICENSE).

Copyright (c) Special Man Global Solution LTD.
