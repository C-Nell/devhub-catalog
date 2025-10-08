# Red Hat Developer Hub Support Model Outline

Support Tier Structure

## Tier 1: Infrastructure/Platform Team (Your Team)

### Ownership:

- RHDH platform installation and configuration
- Base infrastructure (Nutanix VMs, networking, storage)
- Platform upgrades and patching
- Keycloak instance management (infrastructure, availability, backups)
- Argo CD instance management (infrastructure, availability)
- Platform-level monitoring and alerting
- Core RHDH plugins (officially supported/shipped with RHDH)
- Integration points configuration (RHDH ↔ Keycloak, RHDH ↔ Argo CD)

### NOT Our Responsibility:

- Custom plugin development or debugging
- Application-specific Argo CD pipelines/applications
- Custom catalog entities created by development teams
- Business logic within templates or plugins

## Tier 2: OpenShift Infrastructure Team
### Ownership:

- OpenShift cluster management
- OpenShift upgrades and patching
- Cluster-level RBAC
- OpenShift monitoring and performance
- Integration configuration (RHDH → OpenShift API access)

## Tier 3: Application/Development Teams
### Ownership:

- Custom plugin development and maintenance
- Software catalog entity definitions
- Software templates they create
- Their Argo CD applications and manifests
- Their Keycloak realm configurations (if self-service)
- Documentation for their custom components

## Plugin Support Policy
- Core/Official Plugins - Platform Team
- Plugins shipped with RHDH
- Red Hat supported plugins
- Platform-level integrations (GitHub, GitLab, Kubernetes)

## Custom Plugins (Development Team Responsibility)
Clear Policy:
"The Infrastructure team provides the RHDH platform and ensures 
custom plugins can be integrated. Development teams are responsible 
for the development, testing, documentation, and support of their 
custom plugins. The Infrastructure team may assist with integration 
issues but does not debug custom plugin code."
Requirements for Custom Plugins:

- Must be documented by the owning team
- Must include a support contact/team
- Must not impact platform stability
- Must pass security review

## Support Workflows
- Intake Process

## Support Request Received → Triage
- Is it infrastructure/platform related?

- Yes → Your team handles
- No → Route to appropriate team


## Is it a custom plugin issue?

Yes → Route to plugin owner (dev team)
No → Continue troubleshooting

Escalation Paths
User/Dev Team
     ↓
Platform Team (Tier 1 Support)
     ↓
├─→ OpenShift Team (for cluster issues)
├─→ Red Hat Support (for RHDH/product issues)
└─→ Dev Team (for custom plugin/content issues)

5. Service Boundaries Document
Create a clear document stating:
We Provide:

A working, available RHDH platform
Integrated authentication (Keycloak)
Integrated CI/CD capability (Argo CD)
Connection to OpenShift clusters
Core plugin functionality
Platform documentation and runbooks
SLA for platform availability (e.g., 99.5%)

We Don't Provide:

Custom plugin development
Debugging custom catalog entities
Argo CD application YAML troubleshooting
Software template logic debugging
Training on custom tools/plugins

Shared Responsibilities:

Security reviews (you provide process, they follow it)
Integration testing (you provide sandbox, they test)
Documentation (you document platform, they document customizations)


6. Governance Model
Platform Engineering Council

Members: Infrastructure, OpenShift, Dev Team reps
Meets: Bi-weekly or monthly
Decides:

Which plugins become "core" (your responsibility)
Platform roadmap
Breaking changes and migration plans
Support policy updates

Change Advisory Board (CAB)
For changes that affect multiple teams:

Platform upgrades
New core plugin additions
Breaking API changes

## Metrics & SLAs
Your Team's SLAs:

- Platform availability: 99.5%
- P1 incident response: 30 minutes
- P2 incident response: 4 hours
- Platform patching: Monthly
- Core plugin updates: Within 2 weeks of release

## Dev Team SLAs (for their components):

- Custom plugin issues: Defined by their team
- Catalog updates: Self-service
- Template fixes: Defined by their team

## Communication Strategy

## Documentation:

- Platform Runbook (your responsibility)
- Plugin Development Guide (your responsibility - how to develop, not the actual plugins)
- Custom Plugin Registry (dev teams maintain their entries)

## Support Channels:

Teams: #rhdh-platform-support (for platform issues)
Emails: #rhdh-plugin-developers (for custom development)
Ticketing System: Tag issues appropriately (platform vs. custom)

## Onboarding Requirements
For New Teams Using RHDH:

Acknowledge support model
Assign a team liaison
Complete platform training
Register custom plugins in catalog
Provide support contact for their custom components




```
Quick Decision Tree

Is the RHDH platform down/unavailable?
  YES → Infrastructure Team

Is Keycloak/Argo CD instance down?
  YES → Infrastructure Team

Is OpenShift cluster down?
  YES → OpenShift Team

Is a core plugin not working?
  YES → Infrastructure Team

Is a CUSTOM plugin not working?
  YES → Plugin Owner (Dev Team)

Is a software template/catalog entity broken?
  YES → Content Owner (Dev Team)

Are Argo CD applications failing?
  YES → Application Owner (Dev Team)
```





