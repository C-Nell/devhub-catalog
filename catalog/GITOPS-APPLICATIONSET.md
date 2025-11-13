# 1. Save the ApplicationSet
```
# 1. Save the ApplicationSet (feature branches only)
cat > applicationset-sssd-features.yaml <<'EOF'
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: sssd-rhdh-sbx-features
  namespace: argocd
spec:
  goTemplate: true
  goTemplateOptions: ["missingkey=error"]
  generators:
  - git:
      repoURL: https://github.enterprise.com/Infra-Platform/devhub-gitops.git
      revision: HEAD
      branches:
      - feature/*
  template:
    metadata:
      name: 'sssd-{{.branch | normalize}}'
      finalizers:
      - resources-finalizer.argocd.argoproj.io
    spec:
      project: default
      sources:
      - repoURL: https://github.enterprise.com/Infra-Platform/devhub-gitops.git
        path: core
        targetRevision: '{{.branch}}'
        helm:
          valueFiles:
          - $values/values-sbx.yaml
      - repoURL: https://github.enterprise.com/Infra-Platform/devhub-platform.git
        targetRevision: main
        ref: values
      destination:
        server: https://kubernetes.default.svc
        namespace: sssd-rhdh-sbx
      syncPolicy:
        # Manual sync for all feature branches
        syncOptions:
        - PruneLast=true
        retry:
          limit: 2
          backoff:
            duration: 5s
            factor: 2
            maxDuration: 3m0s
EOF
```

# 2. Apply the ApplicationSet (NO deletion of existing app)
kubectl apply -f applicationset-sssd-features.yaml -n argocd

# 3. Verify it worked
```
kubectl get applicationset sssd-rhdh-sbx-features -n argocd
```
```
argocd app list | grep sssd
```

## What You'll Have
```
Existing Application (manual sync):
├── sssd-rhdh-sbx → sssd-rhdh-sbx branch → sssd-rhdh-sbx namespace

ApplicationSet-generated Applications (manual sync):
├── sssd-feature-auth-fix → feature/auth-fix branch → sssd-rhdh-sbx namespace
├── sssd-feature-new-api → feature/new-api branch → sssd-rhdh-sbx namespace
└── sssd-feature-* → feature/* branches → sssd-rhdh-sbx namespace
```

## Your Workflow
Baseline Branch (Existing App)
- bash# Use your existing sssd-rhdh-sbx Application
- Manually sync in UI when needed
- Nothing changes here!
