# frida-node

[![NPM version][npm-v-image]][npm-link]
[![NPM Downloads][npm-dm-image]][npm-link]


Node.js bindings for [Frida](https://frida.re).

## Depends

- Node.js 8.x or newer

## Install

Install from binary:

```sh
npm install
```

Install from source:

```sh
FRIDA=/absolute/path/to/fully/compiled/frida/repo npm install
```

## Examples

* Follow [Setting up the experiment](https://frida.re/docs/functions/) to
  produce a binary.
* Run the binary.
* Take note of the memory address the binary gives you when run.
* Run any of the examples, passing the name of the binary as a parameter, and
  the memory address as another.

(**Note**: only some examples use the memory address)

## Developing

The [prebuild](https://github.com/mafintosh/prebuild) tool is used to handle
building from source and packaging.

To recompile only the C++ files that have changed, first run the
"Install from source" step above, then simply run:

```sh
make -C build
```

### Packaging

```sh
npm run prebuild
```

[npm-link]: https://www.npmjs.com/package/frida
[npm-v-image]: https://img.shields.io/npm/v/frida.svg
[npm-dm-image]: https://img.shields.io/npm/dm/frida.svg
