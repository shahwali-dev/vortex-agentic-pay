# 🛡️ Security Policy: Vortex Agentic Pay

The integrity and sovereign control of **Vortex Agentic Pay** infrastructure depend on rigorous threat modeling and continuous verification.

---

## 📈 Supported Infrastructure & Updates

Security patches are automatically propagated through our CI/CD pipelines. We prioritize zero-trust dependencies.

| Component | Status | Policy |
| :--- | :---: | :--- |
| **Agentic Core** (`main`) | ✅ | Continuous Security Audits & Automated Dependency Updates |
| **EIP-7702 Integration** | ✅ | Periodic Smart Account Vulnerability Scanning |
| **Legacy/Pre-Agentic** | ❌ | EOL - Immediate upgrade required |

---

## 🚨 Vulnerability Disclosure Policy

If you identify a vulnerability within the **Vortex Agentic Pay** ecosystem—particularly concerning **Agentic Budget Authorization**, **EIP-7702 execution flow**, or **Smart Account credential handling**—please refrain from public disclosure.

### Private Remediation Workflow
1. **GitHub Private Advisories:** Use the `Security > Advisories` tab in this repository to report the issue directly.
2. **Encrypted Communication:** For critical agent infrastructure flaws, reach out via the verified maintainer channels listed in our metadata.
3. **Strict Confidentiality:** All reports are handled in an isolated environment to prevent exploitation during the patching window.

---

## ⏳ Operational SLA

> 💡 **Sovereign Security Promise:** We prioritize the protection of agent-delegated assets and autonomous payment execution above all else.

* **Initial Triage:** Vulnerability reports are verified within **24 hours**.
* **Remediation Cycle:** High-severity issues impacting smart account authorization are patched within **48 hours**.
* **Transparency:** Verified contributors will be recognized in the `SECURITY.md` credit logs upon successful deployment of the hardened patch.

---

## 🔑 Secure Development Standards

* **Dependency Locking:** All sub-dependencies are strictly version-locked using `pnpm-lock.yaml`.
* **Container Security:** Minimalist base layers are used to reduce the attack surface of the production agent environment.
* **Agentic Hardening:** We follow the principle of "Least Privilege" for all autonomous agent execution paths.

---
**Engineered and Hardened by [Shah Wali (shahwali-dev)](https://github.com/shahwali-dev)**
*Vortex Agentic Pay: Sovereign Infrastructure for Autonomous Agents.*
