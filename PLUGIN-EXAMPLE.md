# front-end-test

Welcome to the front-end-test plugin!

_This plugin was created through the Backstage CLI_


## Plugin Development (Examples)

### Create a plugin with this command
```
node .yarn/releases/yarn-*.cjs new
```
```
? What do you want to create? (Use arrow keys)
❯ frontend-plugin - A new frontend plugin 
  backend-plugin - A new backend plugin 
  backend-plugin-module - A new backend module that extends an existing backend plugin 
  plugin-web-library - A new web library plugin package 
  plugin-node-library - A new Node.js library plugin package 
  plugin-common-library - A new isomorphic common plugin package 
  web-library - A library package, exporting shared functionality for web environments 
(Move up and down to reveal more choices)
```

### Example: Adding front end plugin to sidebar navigation
Open sidebar configuration file:
```
packages/app/src/components/Root/Root.tsx
```

### Add your sidebar item:
Find the <SidebarPage> component and add a new <SidebarItem> for your plugin:
```
import { SidebarItem } from '@backstage/core-components';
// Add your icon import
import ExtensionIcon from '@material-ui/icons/Extension'; // or whatever icon you want

// Inside the <SidebarPage> component, add:
<SidebarItem icon={ExtensionIcon} to="front-end-test" text="My Plugin" />
```

### Make sure your plugin route is registered in App.tsx:
Open packages/app/src/App.tsx and ensure you have:
```
import { FrontEndTestPage } from '@internal/plugin-front-end-test'; // adjust import path

// Inside your <FlatRoutes>:
<Route path="/front-ent-test" element={<FrontEndTestPage />} />
```

## To Restart Backend after Development Changes
```
node restart-script.js
```