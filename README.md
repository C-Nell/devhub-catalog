[![headline](docs/assets/headline.png)](https://backstage.io/)

# [Backstage](https://backstage.io)

This is a scaffolded Backstage App, Good Luck!

## Run Initial Startup Script
To start the app in dev spaces, open a terminal a run:

```
node startup-script.js
```

## To Restart Backend after Development Changes
```
node restart-script.js
```

## Quick restart
```
node .yarn/releases/yarn-*.cjs workspace backend start
```

## Documentation Sources:

The documentation of Backstage includes:
- [Devfile Resources](https://devfile.io/docs/2.3.0/)
- [Main documentation](https://backstage.io/docs)
- [Software Catalog](https://backstage.io/docs/features/software-catalog/)
- [Architecture](https://backstage.io/docs/overview/architecture-overview) ([Decisions](https://backstage.io/docs/architecture-decisions/))
- [Designing for Backstage](https://backstage.io/docs/dls/design)
- [Storybook - UI components](https://backstage.io/storybook)


### Useful commands 

- Create a token: 
```
node -p 'require("crypto").randomBytes(24).toString("base64")'
```

