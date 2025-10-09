## Backstage API Calls

### APP CONFIG VALUES
```
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: ""
          subject: automation-system
```

### API CALLS 


### GET CALLS
```
# Get catalog entities
TOKEN=""
BASE_URL="https://poteatc-backstage-devspace-backend.apps.rm1.0a51.p1.openshiftapps.com"
CATALOG_ENDPOINT="/api/catalog/entities"
```
```
#### Add -v for verbose output and --max-time to prevent hanging
curl -v --max-time 10 \
  -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}${CATALOG_ENDPOINT}"
```
### Get template schema
```
TOKEN=""
BASE_URL="https://poteatc-backstage-devspace-backend.apps.rm1.0a51.p1.openshiftapps.com"
```

# Get the template parameter schema (without jq)
```
curl -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}/api/scaffolder/v2/templates/default/template/example-nodejs-template/parameter-schema"
```

### POST CALLS

### Launch Template
```
TOKEN=""
BASE_URL="https://poteatc-backstage-devspace-backend.apps.rm1.0a51.p1.openshiftapps.com"

  
  curl -X POST "${BASE_URL}/api/scaffolder/v2/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateRef": "template:default/example-nodejs-template",
    "values": {
      "name": "test-app-123",
      "owner": "user:default/guest",
      "repoUrl": "github.com?owner=c-poteat&repo=test-app-123"
    }
  }'
  ```
  
  
### Scaffolder API (Templates)Create/Launch a Template Task
###  Endpoint POST /api/scaffolder/v2/tasks

#### Purpose: Launch a software template to create new componentsExample:
```
curl -X POST "${BASE_URL}/api/scaffolder/v2/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateRef": "template:default/my-template",
    "values": {
      "name": "my-component",
      "owner": "user:default/guest",
      "repoUrl": "github.com?owner=myorg&repo=my-component"
    },
    "secrets": {
      "githubToken": "optional-github-token"
    }
  }'
  ```
 ### Launch template without running it 
 #### Dry Run
 ```
TOKEN=""
BASE_URL="https://poteatc-backstage-devspace-backend.apps.rm1.0a51.p1.openshiftapps.com"

curl -X POST "${BASE_URL}/api/scaffolder/v2/dry-run" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "apiVersion": "scaffolder.backstage.io/v1beta3",
      "kind": "Template",
      "metadata": {
        "name": "test-template",
        "title": "Test Template"
      },
      "spec": {
        "owner": "user:default/guest",
        "type": "service",
        "parameters": [
          {
            "title": "Provide information",
            "required": ["name"],
            "properties": {
              "name": {
                "title": "Name",
                "type": "string"
              }
            }
          }
        ],
        "steps": [
          {
            "id": "log",
            "name": "Log Message",
            "action": "debug:log",
            "input": {
              "message": "Hello ${{ parameters.name }}!"
            }
          }
        ]
      }
    },
    "values": {
      "name": "TestApp"
    },
    "secrets": {},
    "directoryContents": []
  }'
  ```
  
  
  
### GET - List entities
```
GET /api/catalog/entities?limit=50
```
### GET - Query with filters
```
GET /api/catalog/entities/by-query?filter=kind=component,spec.owner=team:default/platform
```
### GET - Get specific entity
```
GET /api/catalog/entities/by-name/component/default/my-service
```
### POST - Register location
```
POST /api/catalog/locations
{"type":"url","target":"https://github.com/org/repo/blob/main/catalog-info.yaml"}
```

### POST - Validate entity
```
POST /api/catalog/validate-entity
{"entity":{...}}

# POST - Refresh entity
POST /api/catalog/refresh
{"entityRef":"component:default/my-service"}

# DELETE - Remove entity
DELETE /api/catalog/entities/by-uid/abc-123-def
```

### GET - List tasks
```
GET /api/scaffolder/v2/tasks?createdBy=user:default/guest

# POST - Launch template
POST /api/scaffolder/v2/tasks
{"templateRef":"template:default/nodejs","values":{...}}

# GET - Get task status
GET /api/scaffolder/v2/tasks/abc-123

# GET - Get task logs
GET /api/scaffolder/v2/tasks/abc-123/events

# POST - Cancel task
POST /api/scaffolder/v2/tasks/abc-123/cancel

# POST - Retry task
POST /api/scaffolder/v2/tasks/abc-123/retry
```

### GET - List actions
```
GET /api/scaffolder/v2/actions
```
### GET - Get template schema
```
GET /api/scaffolder/v2/templates/default/template/my-template/parameter-schema
```
### POST - Dry run
```
POST /api/scaffolder/v2/dry-run
{"template":{...},"values":{...}}
```

### SEARCH API

#### GET - Search with filters
```
GET /api/search/query?term=api&filters[kind]=api&filters[lifecycle]=production
```
```
# TECH Docs
# GET - Get docs metadata
GET /api/techdocs/default/component/default/my-service

# GET - Get docs HTML
GET /api/techdocs/static/docs/default/component/my-service/index.html

# POST - Trigger build
POST /api/techdocs/sync/default/component/my-service
```

```
# PERMISSIONS RBAC

# GET - List roles
GET /api/permission/roles

# POST - Create role
POST /api/permission/roles
{"name":"role:default/developers","memberReferences":[...]}

# GET - Get specific role
GET /api/permission/roles/role/default/developers

# PUT - Update role
PUT /api/permission/roles/role/default/developers
{"memberReferences":[...],"metadata":{...}}

# DELETE - Delete role
DELETE /api/permission/roles/role/default/developers

# GET - List policies
GET /api/permission/policies

# POST - Create policy
POST /api/permission/policies
[{"entityReference":"role:default/dev","permission":"catalog-entity","policy":"read","effect":"allow"}]

# PUT - Update policy
PUT /api/permission/policies/1
{"permission":"catalog-entity","policy":"update","effect":"allow"}

# DELETE - Delete policy
DELETE /api/permission/policies/1

# GET - List conditional policies
GET /api/permission/roles/conditions

# POST - Create conditional policy
POST /api/permission/roles/conditions
{"roleEntityRef":"role:default/dev","pluginId":"catalog",...}

# PUT - Update conditional policy
PUT /api/permission/roles/conditions/1
{...}

# DELETE - Delete conditional policy
DELETE /api/permission/roles/conditions/1
```
```
# AUTH API

# GET - Refresh session
GET /api/auth/github/refresh

# POST - Logout
POST /api/auth/github/logout
```
