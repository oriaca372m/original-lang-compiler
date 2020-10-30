#!/bin/sh

set -eu

yarn run webpack
node --trace-uncaught -r source-map-support/register dist/main.js examples/src.ore asm/compiled.s

cd asm
make run
