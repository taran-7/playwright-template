# General Copilot Instructions

## GitHub interactions via MCP

All GitHub operations (issues, PRs, repos, searches, notifications) **must** be performed through the **GitHub MCP server** (`https://api.githubcopilot.com/mcp/`), not via `gh` CLI or raw REST/GraphQL calls.

Use the MCP tools for:

- Creating / reading / updating issues and PRs
- Searching code and repositories
- Reading file contents from remote repos
- Managing branches and commits
- Checking CI status and workflow runs

This ensures consistent authentication and audit trail across all agents.
