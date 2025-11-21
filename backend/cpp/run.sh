#!/bin/sh
set -e

file="$1"

# Compile
g++ "$file" -o program.out

# Run
./program.out