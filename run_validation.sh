#!/bin/bash

echo "🔍 Running Phase 2 Implementation Validation"
echo "=============================================="

# Run the validation script
node validation_check.js

echo ""
echo "🧪 Running existing test suite"
echo "==============================="

# Run the existing test suite
node run_tests.js

echo ""
echo "📁 Final directory structure:"
echo "=============================="
find . -type f -name "*.yml" -o -name "*.json" -o -name "*.js" -o -name "*.md" | grep -E '\.(yml|json|js|md)$' | sort