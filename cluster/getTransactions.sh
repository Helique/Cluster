#!/bin/bash
cd casperjs
casperjs login.js
cd ..
mkdir transactions
mv casperjs/*.qfx transactions/
node scripts/process_transactions.js
mv transactions/*.qfx saved_transactions/
