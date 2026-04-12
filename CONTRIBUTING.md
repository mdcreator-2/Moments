# Contributing to Moments

Thanks for your interest in contributing to **Moments**!  
This project was built quickly during a hackathon, so we welcome improvements.

---

## Development Setup

1. Fork and clone the repository
2. Start Redis locally
3. Setup backend virtualenv and install dependencies
4. Setup frontend dependencies
5. Run backend, worker(s), and frontend concurrently

See [README.md](./README.md) for full commands.

---

## Branch Naming

Use descriptive branch names:

- `feat/<short-feature-name>`
- `fix/<short-bug-name>`
- `chore/<short-task-name>`

Examples:
- `feat/clip-style-presets`
- `fix/render-status-polling`
- `chore/readme-update`

---

## Commit Messages

Keep commits focused and clear:

- `feat: add subtitle style selector`
- `fix: handle missing thumbnail gracefully`
- `docs: improve local setup instructions`

---

## Pull Request Guidelines

Please include:

1. **What changed**
2. **Why it changed**
3. **How to test**
4. Screenshots/GIFs for frontend changes (if relevant)

Keep PRs small and reviewable where possible.

---

## Code Style

- Frontend: TypeScript + React conventions, keep components readable and typed
- Backend: Python with clear service separation and explicit error handling
- Prefer descriptive names over clever shortcuts
- Avoid large unrelated refactors in the same PR

---

## Reporting Bugs

Open an issue with:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Logs/errors
- Environment info (OS, Python/Node versions)

---

## Security

If you find a security issue, please avoid posting secrets publicly.  
Open a private report to maintainers when possible.

---

Thanks for helping improve Moments 🚀