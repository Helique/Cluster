#!/bin/bash
cd "$(dirname "$0")"
cd ../../../casperjs
casperjs mechanics_bank.js $1
cd ..
#mkdir transactions
mv casperjs/*.qfx transactions/
