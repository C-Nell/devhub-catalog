#!/bin/bash

# Get the DevSpaces namespace and routing suffix
NAMESPACE=$(oc project --short)
ROUTING_SUFFIX=$(oc get route console -n openshift-console -o jsonpath='{.spec.host}' | sed 's/^console-openshift-console\.//')

# Set environment variables for Backstage URLs
export BACKSTAGE_BASE_URL="https://backstage-frontend-${NAMESPACE}.${ROUTING_SUFFIX}"
export BACKSTAGE_BACKEND_URL="https://backstage-backend-${NAMESPACE}.${ROUTING_SUFFIX}"

echo "Starting Backstage with:"
echo "Frontend URL: $BACKSTAGE_BASE_URL"
echo "Backend URL: $BACKSTAGE_BACKEND_URL"

# Start Backstage with the DevSpaces configuration
yarn dev --config app-config.devspaces.yaml
