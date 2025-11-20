#!/bin/sh
set -e

file="$1"

# Compile
javac "$file"

# Run without extension
classname=$(basename "$file" .java)
java "$classname"
