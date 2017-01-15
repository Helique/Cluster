#!/bin/bash
cd "$(dirname "$0")"
cd ../../../casperjs
casperjs test.js $1
cd ..
#mkdir transactions
mv casperjs/*.qfx transactions/
