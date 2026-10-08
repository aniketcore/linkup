# Agent Handoff Prompt

Use this prompt in any collaborator agent session:

I am joining an in-progress hackathon project. Follow this workflow exactly.

1. Read documents/collaboration_runbook.md first.
2. Read documents/hackathon_execution_plan.md second.
3. Continue from the Current Next Task in the runbook.
4. Before editing code, set that task status to IN_PROGRESS.
5. After finishing, set task to DONE and fill completion notes.
6. Update Current Next Task and add a handoff note.
7. Do not start tasks out of dependency order.
8. Preserve sequential workflow rules, mandatory remarks rules, and full audit logging.

Output format required from agent on each handoff:
1. Completed Task IDs
2. Files Changed
3. Validation Performed
4. Known Issues
5. Next Task ID
6. First command the next person should run
