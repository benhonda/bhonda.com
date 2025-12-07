#!/bin/bash
set -euo pipefail

echo "Installing Bun and Claude CLI..."
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Ensure Bun binaries are on PATH for this non-interactive shell
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Install Claude Code CLI globally (provides the `claude` command)
bun add -g @anthropic-ai/claude-code

# (Optional) verify
claude --version || { echo "Claude CLI not found on PATH"; exit 1; }

# Try to trust the package, but don't fail if it's already trusted or has no scripts
echo "Trusting Claude CLI package (if needed)..."
bun pm -g trust @anthropic-ai/claude-code 2>/dev/null || true

# echo "🎭 Installing Playwright browser (Firefox)..."

# # Use bunx (or npx if you prefer) to install Playwright browser + system deps
# # Using Firefox for ARM compatibility
# bunx playwright install firefox --with-deps

# echo "🎭 Adding Playwright MCP to Claude..."

# # Register the Playwright MCP server with Claude.
# # Use bunx to resolve the @playwright/mcp executable without needing a local install.
# # Pass --browser firefox flag to use Firefox instead of default Chrome
# # Check if playwright MCP already exists and remove it first if it does
# if claude mcp list 2>&1 | grep -q "playwright:"; then
#     echo "Removing existing Playwright MCP server..."
#     claude mcp remove playwright 2>/dev/null || true
# fi
# # Add Playwright MCP with Firefox browser (ARM compatible)
# # Note: Use -- separator before MCP arguments
# claude mcp add playwright bunx '@playwright/mcp@latest' -- '--browser' 'firefox'

echo "✅ Done post-create.sh"
