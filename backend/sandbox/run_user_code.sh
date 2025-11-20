#!/bin/bash
# run_user_code.sh: Script executed inside the secure Docker container

# The user's file is mounted into /tmp/input (read-only)
USER_FILE="/tmp/input/$1"
FILENAME=$(basename "$USER_FILE")
EXTENSION="${FILENAME##*.}"

echo "--- Starting Execution ---"

if [ ! -f "$USER_FILE" ]; then
    echo "Error: File not found at $USER_FILE" >&2
    exit 1
fi

# We use 'case' to select the correct runner based on file extension
case "$EXTENSION" in
    py)
        # Execute Python code
        python3 "$USER_FILE"
        ;;
    c)
        # Compile C code, then run the binary
        BINARY_NAME="/tmp/output_$(date +%s%N)"
        
        # Compile: output compilation errors to stderr
        if ! gcc "$USER_FILE" -o "$BINARY_NAME"; then
            echo "--- Compilation Failed ---" >&2
            exit 1
        fi
        
        # Run the compiled binary
        echo "--- Compilation Successful. Running ---"
        "$BINARY_NAME"
        
        # Clean up the compiled binary (important for space)
        rm -f "$BINARY_NAME"
        ;;
    *)
        echo "Error: Unsupported file type: .$EXTENSION" >&2
        exit 1
        ;;
esac

echo "--- Execution Finished ---"