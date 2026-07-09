# AI Agent Best Practices

This document outlines the standard best practices for interacting with and developing AI agents within this workspace. It is divided into four core pillars: **RBI**, **Rules**, **Brain**, and **Implementation**.

## 1. RBI (Role, Behavior, Intent/Instructions)

The RBI framework defines the fundamental persona and operational scope of the agent.

* **Role**: 
  * Clearly define the agent's domain of expertise (e.g., Frontend Specialist, Backend Architect, DevOps Engineer).
  * The agent must adopt this persona consistently across all interactions, avoiding context drift.
* **Behavior**:
  * Adopt a proactive, solution-oriented mindset.
  * Be concise but highly accurate. Avoid unnecessary pleasantries.
  * When uncertain, always ask clarifying questions rather than making blind assumptions.
* **Intent (Instructions)**:
  * Deconstruct complex intents into smaller, actionable sub-tasks.
  * Always align actions with the user's ultimate goal, anticipating next steps.

## 2. Rules

Rules are strict constraints and guidelines that the agent must never violate.

* **Codebase Constraints**:
  * Adhere strictly to the project's existing architectural patterns and style guides (e.g., SOLID principles, specific naming conventions).
  * Never modify third-party libraries or auto-generated files unless explicitly instructed.
* **Safety & Security**:
  * 🔴 **CRITICAL**: Adhere strictly to the security policies defined in [.agents/rules/sicurezza.md](.agents/rules/sicurezza.md).
  * Never hardcode secrets, API keys, or sensitive credentials in the code.
  * Validate all inputs to prevent common vulnerabilities (e.g., injection attacks, XSS).
* **Communication Rules**:
  * Maintain documentation integrity. Do not strip out existing comments unless they are obsolete.
  * Use standard GitHub-flavored markdown for all technical explanations.

## 3. Brain

The "Brain" refers to how the agent handles context, memory, and reasoning.

* **Context Management (Single Source of Truth)**:
  * Always rely on the `.agents/` directory or specific `SKILL.md` files as the ultimate source of truth for workflows.
  * Read relevant documentation and files before executing complex changes. Do not rely solely on pre-training memory.
* **Reasoning (Chain of Thought)**:
  * Plan before executing. Use a step-by-step reasoning approach for complex problem-solving.
  * Evaluate trade-offs explicitly when proposing architectural changes.
* **Tool Usage**:
  * Prioritize the most specific tools available (e.g., use specialized search tools instead of generic shell commands).
  * Parse tool outputs carefully to inform the next steps.

## 4. Implementation

Implementation covers the physical execution of tasks, code writing, and testing.

* **Execution Strategy**:
  * Implement changes incrementally. Do not rewrite entire files if a targeted replacement is sufficient.
  * Run validation or compilation steps locally (if tools allow) to ensure code correctness before finalizing a task.
* **Code Quality**:
  * Write clean, self-documenting code.
  * Include targeted unit tests or integration tests for any newly implemented business logic.
* **Error Handling**:
  * If a command or script fails, analyze the error output deeply. Do not blindly retry the same command.
  * Provide clear, actionable summaries of what was fixed and what remains to be done.
