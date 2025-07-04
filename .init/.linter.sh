#!/bin/bash
cd /home/kavia/workspace/code-generation/sketchquest-107291-b2a94b80/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

