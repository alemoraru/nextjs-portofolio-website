# Security Policy

## Supported Versions

This is a personal portfolio website that is continuously deployed from the `main` branch.
Only the latest release (and the current state of `main`) receives security fixes.

| Version        | Supported |
| -------------- | --------- |
| Latest release | ✅        |
| Older releases | ❌        |

In short, if you are using an older release, and you discover a security vulnerability that has been fixed since that
release, you should upgrade to the latest release. If you are using the latest release and discover a security
vulnerability, please report it to me privately (see below).

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities.

Instead, report them privately through GitHub's
[private vulnerability reporting](https://github.com/alemoraru/nextjs-portofolio-website/security/advisories/new).

When reporting, please include:

- A description of the issue and its potential impact
- Steps to reproduce (URLs, payloads, screenshots or a proof of concept)
- Any suggested fix or mitigation, if you have one

## What to Expect

- **Acknowledgement:** within 5 business days
- **Assessment and updates:** I will keep you informed of progress as the report is triaged
- **Resolution:** confirmed vulnerabilities will be fixed as soon as reasonably possible and
  released, with credit to the reporter unless you prefer to remain anonymous

If a report is declined (for example, it is out of scope or not reproducible), I will explain why.

## Scope

In scope:

- The code in this repository and the deployed website built from it
- Vulnerabilities in how this project uses its dependencies

Out of scope:

- Vulnerabilities in third-party services or platforms (hosting provider, analytics, etc.);
  please report those to the respective vendor
- Social engineering, physical attacks, or denial-of-service/volume-based testing
- Automated scanner output without a demonstrated impact
- Missing best-practice headers or configuration with no practical exploit

Thank you for helping keep this project and its visitors safe.
