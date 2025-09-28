# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

When your DevSpaces workspace starts:

First, check your routes:

bash   
```
oc get routes
```
Set the environment variables using the actual route URLs:

bash   
```
export BACKSTAGE_BASE_URL="https://frontend-your-actual-route.apps.cluster.com"
export BACKSTAGE_BACKEND_URL="https://backend-your-actual-route.apps.cluster.com"
```

Start your app:

bash   
```
yarn dev
```

Or create a simple startup script in your project root called start.sh:
```
bash#!/bin/bash
export BACKSTAGE_BASE_URL="https://$(oc get route frontend -o jsonpath='{.spec.host}')"
export BACKSTAGE_BACKEND_URL="https://$(oc get route backend -o jsonpath='{.spec.host}')"
echo "Frontend: $BACKSTAGE_BASE_URL"
echo "Backend: $BACKSTAGE_BACKEND_URL"
yarn dev
```

This approach is more reliable since it uses the actual routes OpenShift creates rather than trying to guess the URL pattern.



To start the app, run:

```sh
yarn install
yarn start
```
