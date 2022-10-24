# `sphere`

"Sphere" is a monorepo consists of several typescript packages to provide safer, easier, and managable interface to sign transactions used in Libplanet-based projects, with various source of private key.

## Project Structure

- `/packages`
  ### signing-interface
  Signing interface provides a unified method of signing transactions regardless of source of key (account).
  - `/sign`
  ### account-providers
  Account providers implement it's own method of handling private key safely, storing (or deriving) public key, and returning signature of given digest or hash.
  - `/account-raw`
  - `/account-local`
  - `/account-aws-kms`

## Package Installation

```
# First Add Signing Interface as Dependency
yarn add @planetarium/sign

# Then Add Required Account Provider
yarn add @planetarium/account-raw
yarn add @planetarium/acocount-local
yarn add @planetarium/account-aws-kms
```

## Source Development Setup

```
git clone git@github.com:planetarium/sphere.git
cd sphere

# yarn workspace plugin is enabled, so you don't have to yarn install every package manually.
yarn install

# Builds all packages
yarn workspaces foreach run build
```
