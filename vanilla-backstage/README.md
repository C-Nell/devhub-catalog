# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app in Dev Spaces, run:

## Yarn Install
```
yarn install
```

## Build both frontend and backend
```
yarn build:all
```

## Start only the backend (which will serve the built frontend)
```
yarn workspace backend start
```

## Make these annotations in app config
```
app:
  baseUrl: https://poteatc-backstage-min-backend.apps.rm1.0a51.p1.openshiftapps.com  
  listen:
    host: 0.0.0.0
    port: 7007

backend:
  baseUrl: https://poteatc-backstage-min-backend.apps.rm1.0a51.p1.openshiftapps.com
  listen:
    host: 0.0.0.0
    port: 7007
```

## Make these annotations in devfile
```
      endpoints:
        - name: frontend
          targetPort: 3000
          exposure: public
          protocol: https  # Changed from http
          secure: false    # Add this - tells OpenShift not to do TLS termination
        - name: backend
          targetPort: 7007
          exposure: public
          protocol: https
          secure: false
```
