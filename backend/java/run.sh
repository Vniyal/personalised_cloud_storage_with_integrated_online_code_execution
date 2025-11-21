#!/bin/sh
set -e

SRC="/tmp/input/$1"

if [ ! -f "$SRC" ]; then
    echo "Error: file not found inside container: $SRC"
    exit 2
fi

# Create writable working directory
WORKDIR="/tmp/work"
mkdir -p "$WORKDIR"

# Compile into WORKDIR, but refer to the real file in /tmp/input
javac -d "$WORKDIR" "$SRC"

# Extract class name (filename without .java)
CLASS=$(basename "$SRC" .java)

# Run the class from WORKDIR
java -cp "$WORKDIR" "$CLASS"