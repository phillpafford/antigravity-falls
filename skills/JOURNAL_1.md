# Journal 1: Infrastructure, Docker & Security Rules
*Instructions: Place this file in your project's `.agent/skills/` directory. Fill in the brackets `[]` with your infrastructure requirements.*

## 🐳 Containerization & Deployment
- **Base Image**: `[e.g. node:22.17.0-alpine, python:3.12-slim]`
- **Build Multi-stage**: `[e.g. Enabled / Required to minimize image footprint]`
- **User Privileges**: `[e.g. Non-root execution is strictly mandated (e.g. USER node)]`
- **Secrets Injection**: `[e.g. Secrets must NEVER be baked into images; use container env mounts]`

## 🔒 Security Invariants (Stan & Bill Cipher)
- **Encryption**: `[e.g. All production traffic must be served over TLS 1.3]`
- **CORS Rules**: `[e.g. CORS allow-list must be explicitly declared; wildcard '*' is forbidden]`
- **Token Expiry**: `[e.g. Session tokens must use secure JWT standards with max expiry of 1 hour]`
- **Security Scanning**: `[e.g. Zero critical or high-severity vulnerabilities allowed in dependencies]`
