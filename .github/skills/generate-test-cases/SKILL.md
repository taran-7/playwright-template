---
name: generate-test-cases
description: >
  Generate a test cases catalogue for an SP/Flowersdrop ticket by reading the YouTrack ticket,
  its comments, the implementation plan from a GitHub PR, and the local test strategy file.
  Use when asked to "generate test cases for SP-####", "create TC catalogue for SP-####",
  "write test cases for SP-####", or when a ticket identifier like "SP-1766 Drag and drop
  improvements" is provided with intent to produce the test cases doc.
---

# Generate Test Cases Catalogue

## When to use this skill

Invoke when the user provides a ticket reference (e.g. `SP-1766 Drag and drop improvements for scene list`) and wants a test cases catalogue generated. The user provides a single input containing the ticket ID and optionally the ticket title.

Trigger phrases:

- "generate test cases for SP-####"
- "create TC catalogue for SP-####"
- "write test cases for SP-####"
- Any message containing an SP-#### ticket reference with intent to produce test cases

## Input

A single string containing the ticket ID and optionally the title:

```
SP-1766 Drag and drop improvements for scene list
```

Extract the ticket ID by matching the pattern `SP-\d+` from the input.

## Mandatory prerequisites

**CRITICAL:** Before generating any test cases, the agent MUST:

1. **Read the FULL ticket description** — not a summary, not a snippet. The entire `description` field must be fetched and read. This contains acceptance criteria, desired behavior, current behavior, and links that define what the test cases must cover.
2. **Read ALL comments on the ticket** — every single comment, regardless of how many there are. Comments contain architectural decisions, reviewer feedback, scope changes, and constraints that directly affect test case design. Do NOT skip comments. Do NOT summarize without reading. Fetch them ALL and incorporate relevant context into the test cases.

If either of these steps fails (network error, auth issue), STOP and inform the user. Do not proceed with partial context.

## Workflow

### Step 1 — Read the FULL YouTrack ticket (MANDATORY)

Fetch the COMPLETE ticket description and all fields. Read the entire response — do not truncate or summarize:

```bash
curl -s -H "Authorization: Bearer $YT_KEY" \
  "$YT_BASE_URL/api/issues/{ticketId}?fields=id,idReadable,summary,description,customFields(name,value(name,text))"
```

Verify: the `description` field is fully read and contains the acceptance criteria.

**MANDATORY OUTPUT after this step — print to chat:**

> ✅ **Acceptance Criteria read from {ticketId}:**
>
> - List each AC bullet point or numbered item extracted from the ticket description
> - If AC is structured (Given/When/Then, bullet list, numbered), reproduce the structure
> - If no explicit AC section exists, list the behavioral expectations extracted from the description

This output confirms to the user that the AC was fully consumed before proceeding.

### Step 2 — Read ALL YouTrack comments (MANDATORY)

Fetch every comment on the ticket. This is non-negotiable — comments contain critical architectural decisions and reviewer feedback that change the implementation approach:

```bash
curl -s -H "Authorization: Bearer $YT_KEY" \
  "$YT_BASE_URL/api/issues/{ticketId}/comments?fields=id,text,author(name),created"
```

Verify: ALL comments are read. If there are many comments, ensure none are paginated away. Read each comment's `text` field in full. Pay special attention to:

- Architectural suggestions from developers (they override initial assumptions)
- Scope clarifications from PM/PO
- Links to related tickets or PRs
- Feedback that changes the implementation approach

**MANDATORY OUTPUT after this step — print to chat:**

> ✅ **Comments read from {ticketId}:** {N} comments total
>
> - For each comment: `[Author Name, date]` — 1-2 sentence summary of what it says
> - Highlight any comment that changes scope, adds constraints, or links to a PR/related ticket
> - If no comments exist, state: "No comments found on the ticket."

This output confirms to the user that ALL comments were consumed and nothing was skipped.

### Step 3 — Find and read the implementation plan PR

Search for the PR in `slidepresenter-app/ui-app` that contains the ticket ID in its title:

Use `mcp_github_search_pull_requests` or `mcp_github_list_pull_requests` to find PRs matching the ticket ID in repo `slidepresenter-app/ui-app`.

Once found, use `mcp_github_pull_request_read` with `method: get_files` to read the implementation plan markdown file (usually named `*-Implementation-Plan.md`).

If the PR contains a docs file matching `docs/implementation_plans/*{ticketId}*Implementation-Plan*.md`, read its full patch content.

**MANDATORY OUTPUT after this step — print to chat:**

> ✅ **Implementation Plan read from PR:**
>
> - **PR:** #{prNumber} — {PR title}
> - **GitHub link:** `https://github.com/nicdeploy/slidepresenter-app/pull/{prNumber}`
> - **Plan file:** `docs/implementation_plans/{filename}`
> - **Key sections found:** list the main headings from the plan (e.g. "Affected files", "New components", "State changes", etc.)
> - **Files to be modified/created:** list top 5-10 key files from the plan

If the PR or plan file is not found, state clearly what was searched and what failed.

### Step 4 — Find the test strategy file locally

Search the local workspace for the test strategy:

```
file_search: docs/test_strategies/*{ticketId}*
```

The file follows the naming convention: `{ticketId}-*-Test-Strategy.md`

Read the full file content. If not found, stop and ask the user — a test strategy must exist before generating test cases (per `test-cases-doc.instructions.md` rules).

**MANDATORY OUTPUT after this step — print to chat:**

> ✅ **Test Strategy read:**
>
> - **File:** `docs/test_strategies/{filename}`
> - **Layers covered:** list layers from the strategy (e.g. CT, Jest unit, E2E, Manual)
> - **Total scenarios planned:** number from strategy if stated
> - **Key risk areas:** list the main risk items identified in the strategy

This output confirms to the user that the local test strategy was found and fully consumed.

### Step 5 — Generate the test cases catalogue

Follow the rules in `.github/instructions/test-cases-doc.instructions.md` to produce the output file.

Key rules:

- Output file goes to `docs/test_strategies/{ticketId}-{short-slug}-Test-Cases.md`
- Each TC uses **Preconditions / Steps / Expected** format
- Steps are user-visible actions (even for Jest unit tests)
- Fixture references use export paths, never inline JSON
- API routes use `API_ROUTES.<key>`, never inline URL strings
- No spec source code — docs only
- No Testmo API calls — docs only

Structure the TC entries to match:

- The surfaces and layers defined in the test strategy (§5 / §7)
- The ACs from the ticket description
- The architectural decisions from PR comments (especially reviewer feedback)
- The new/modified files from the implementation plan

### Step 6 — Analyze the generated test cases

After generating, perform a self-review:

- Verify all ACs from the ticket are covered
- Verify the TC entries align with the architectural approach from the implementation plan (especially if reviewer feedback changed the approach)
- Identify any gaps and mention them in the output
- List open QA questions in the final section

### Step 7 — Provide analysis, recommendations, and advice (MANDATORY)

After the file is written, present the user with a structured analysis in the chat response (not in the file). Include:

**Coverage analysis:**

- Map each AC from the ticket to the TC entries that cover it (table format)
- Highlight any AC that has weak or indirect coverage

**Identified gaps:**

- Missing negative/boundary cases that would strengthen coverage
- Regression risks from the implementation plan that are not yet covered by any TC
- Shared code blast radius — are all indirect dependents tested?

**Recommendations:**

- Suggest additional TC entries worth adding (with reasoning)
- Flag any TC that may be redundant or overlapping with another
- Recommend priority order for implementation (which TCs to write first based on risk)

**Potential issues:**

- Warn about TCs that may be hard to implement (e.g. complex drag simulation in CT)
- Flag TCs whose Expected section depends on an unresolved open question
- Note any assumptions made that need QA/PM confirmation

**Advice for implementation:**

- Suggest fixture structure or reuse opportunities
- Recommend which TCs can share setup/teardown
- Note any TCs that should be grouped into a single describe block for efficiency

This analysis helps the user make informed decisions before starting test implementation.

## Output

A single markdown file at `docs/test_strategies/{ticketId}-{short-slug}-Test-Cases.md` following the exact structure from `test-cases-doc.instructions.md`.

End with a summary stating:

- File path
- Number of TC entries by tag (`component` / `jest-unit` / `manual`)
- Any open QA questions

## Dependencies

- `$YT_BASE_URL` and `$YT_KEY` environment variables must be set (see user memory `youtrack-setup.md`)
- GitHub MCP tools must be available for PR search
- Test strategy file must exist locally before this skill runs
- `.github/instructions/test-cases-doc.instructions.md` defines the output format rules
