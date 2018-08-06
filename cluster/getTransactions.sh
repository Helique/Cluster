#!/bin/bash
cd casperjs
casperjs sierra_central.js new_transactions.qfx
cd ..
mkdir -p transactions
mv casperjs/*.qfx transactions/
node scripts/process_transactions.js
mkdir -p saved_transactions
mv transactions/*.qfx saved_transactions/
