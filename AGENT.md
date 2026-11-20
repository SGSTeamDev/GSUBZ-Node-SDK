# GSUBZ Node SDK Development Guide

This document is the working agreement for contributors and automated agents in this public repository.

## Project scope

This package is `@specialman/gsubz`, a CommonJS Node.js SDK for GSUBZ APIs. Public behavior includes request payloads, response shapes, error fields, exported method names, and documented examples. Treat changes to those surfaces as compatibility-sensitive.

## Before changing code

1. Read this file, `README.md`, `CONTRIBUTING.md`, and `documentation/usage.md`.
2. Inspect the existing implementation and tests before choosing a pattern.
3. Confirm requested behavior against the GSUBZ API documentation and existing SDK conventions.
4. Check `git status` and preserve unrelated working-tree changes.

## Repository structure

- `app.js`: SDK composition and public entry point.
- `services/`: GSUBZ API service operations.
- `lib/`: shared transport and request behavior.
- `middleware/`: shared error transformation behavior.
- `utils/`: focused reusable helpers only.
- `tests/unit/`: deterministic, credential-free Jest tests.
- `tests/example.test.js`: ignored manual integration template.
- `documentation/`: user-facing SDK reference documentation.
- `scripts/`: repository validation and developer tooling.
- `.githooks/`: versioned local Git hooks.

Keep API behavior in services, transport behavior in `lib/`, and error normalization in `middleware/`. Do not add business behavior to `app.js` or duplicate transport logic across services.

## Implementation standards

- Use the existing CommonJS style and naming conventions.
- Keep functions focused and preserve separation between service, transport, and error concerns.
- Validate external input at the service boundary.
- Preserve provider status codes, response bodies, and actionable diagnostics in errors where available, and bound or redact credential-like values before exposing them.
- Never log the API key, tokens, full provider responses containing personal data, or customer account numbers.
- Do not add dependencies unless the existing toolchain cannot meet the requirement.
- Do not introduce breaking API changes without a major version bump and migration documentation.
- Do not add comments unless they explain a non-obvious constraint.

## GSUBZ behavior

- The SDK is initialized with a GSUBZ API key, which is sent as `Authorization: Bearer <key>`.
- `plans` and `service` are `GET` requests and require a `service` query value that matches a GSUBZ `serviceID`.
- `pay`, `verifyPay`, and `balance` are `POST` requests; `pay` builds a multipart `FormData` body.
- A GSUBZ response can be `200` and still represent a failed transaction when `status` is `"failed"`. Treat that as an error.
- Keep response and error behavior synchronized across `lib/base.js`, `services/index.js`, tests, `documentation/usage.md`, and `CHANGELOG.md`.

## Tests and verification

Every behavior change requires tests for the success path, invalid input, provider failures, and compatibility-sensitive edge cases as applicable.

Run the same commands locally that CI runs:

```bash
npm run lint
npm run test-local
npm run test-workflow
npm run validate-repository
npm run validate-release
npm pack --dry-run
```

`npm run verify` runs lint and the credential-free deterministic tests. `npm run validate-release` requires a clean working tree and a dated changelog heading for the current version, so run it from a release commit or a clean worktree. Do not use the watch-mode `npm test` command as a release gate.

The test suite must never call the live GSUBZ API. Integration behavior stays in `tests/example.test.js` for manual runs.

## Documentation and release rules

Every public API change must update, in the same change:

1. The relevant section under `documentation/`.
2. A working code example that matches the implementation.
3. `CHANGELOG.md` under the current release heading.
4. `README.md` when the public quick-start or supported behavior changes.

Release requirements:

- Update `package.json` and `package-lock.json` to the same version.
- Use a dated Keep a Changelog release heading: `## [x.y.z] - YYYY-MM-DD`.
- Run `npm run verify`, `npm run validate-release`, and `npm pack --dry-run`.
- Stage releases from a reviewed release commit with `npm stage publish`; a maintainer must review and approve the staged package on npm before it becomes public.
- Use a scoped npm credential with the minimum required access and keep `NPM_TOKEN` only in GitHub Actions secrets.
- Never put npm tokens, provider credentials, or `.npmrc` files in the repository.

## Git workflow

- Create a focused branch for each change.
- Open pull requests against `main`. The `dev` branch mirrors `main` and also runs change-review checks.
- Use conventional commit subjects under 72 characters: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, or `chore:`.
- Complete the pull request template and explain compatibility impact.
- Enable the repository hooks with `npm run setup-hooks`.
- Do not bypass hooks with `--no-verify` unless a maintainer documents and approves the exception.
- CI is authoritative; local hooks provide fast feedback and must not replace CI checks.

## Pull request checklist

- [ ] Scope is focused and unrelated changes are preserved.
- [ ] Tests cover success, validation, and provider-error behavior.
- [ ] Documentation examples match the implementation.
- [ ] Changelog and version metadata are synchronized when applicable.
- [ ] `npm run verify` passes.
- [ ] `npm run validate-repository` passes.
- [ ] No secrets or generated artifacts are included.
- [ ] Package contents were checked with `npm pack --dry-run` for releases.
