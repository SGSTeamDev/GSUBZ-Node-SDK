# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- Keep Unreleased section at the top to track upcoming changes. -->

## [Unreleased]

## [1.0.2] - 2026-11-20

### Added

- Repository development guide, versioned Git hooks, repository and release validation scripts.
- CI change-review workflow and unit test suite.
- Input validation for `pay` (`serviceID`) and `verifyPay` (`requestID`).

### Changed

- Preserve and redact provider error details while keeping the public response and error shape.
- Releases are staged for npm maintainer approval instead of published directly from CI.
- Refreshed the dependency lockfile.

### Fixed

- Error responses now keep `status` and `description` in the correct fields.
- Transport no longer mutates caller payloads, and `FormData` bodies skip null or undefined values.
- Missing API keys and request methods now return complete error objects.

### Security

- Bounded and redacted provider diagnostics, including credentials and long numeric identifiers.
- Cleared known critical and high dependency vulnerabilities.

## [1.0.1] - 2025-02-25

### Added

- Update license
- Update usage documentation

## [1.0.0] - 2025-02-22

### Added

- Get Balance
- Get Plans
- Get Service Details
- Payment
- Verify Payment
- Update README.md
- Update documentation

<!-- Example -->

<!-- ## [Unreleased] - Release Date

## [1.2.0] - 2025-03-05

- Tanzania mobile money payment method.

## [1.1.0] - 2025-03-05

### Added

- Arabic translation (#444).
- v1.1 French translation.
- v1.1 Dutch translation (#371).
- v1.1 Russian translation (#410).

### Fixed

- Improve French translation (#377).
- Improve id-ID translation (#416).
- Improve Persian translation (#457).
- Improve Russian translation (#408).
- Improve Swedish title (#419).

### Changed

- Upgrade dependencies: Ruby 3.2.1, Middleman, etc.

### Removed

- Unused normalize.css file.
- Identical links assigned in each translation file.
- Duplicate index file for the english version.

## [1.0.0] - 2025-03-05

### Added

- Arabic translation (#444).
- v1.1 French translation.
- v1.1 Dutch translation (#371).
- v1.1 Russian translation (#410).

### Fixed

- Improve French translation (#377).
- Improve id-ID translation (#416).
- Improve Persian translation (#457).
- Improve Russian translation (#408).
- Improve Swedish title (#419).

### Changed

- Upgrade dependencies: Ruby 3.2.1, Middleman, etc.

### Removed

- Unused normalize.css file.
- Identical links assigned in each translation file.
- Duplicate index file for the english version. -->
