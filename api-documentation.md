---
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: backstage-catalog-api
  description: Catalog API - Manage entities, components, and locations
  tags:
    - catalog
    - core-api
spec:
  type: openapi
  lifecycle: production
  owner: platform-team
  definition: |
    openapi: 3.0.0
    info:
      title: Backstage Catalog API
      version: 1.0.0
    servers:
      - url: https://poteatc-backstage-devspace-backend.apps.rm1.0a51.p1.openshiftapps.com
    paths:
      /api/catalog/entities:
        get:
          summary: List all entities
          parameters:
            - name: limit
              in: query
              schema:
                type: integer
          responses:
            '200':
              description: Success
      /api/catalog/locations:
        post:
          summary: Register new location
          requestBody:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    type:
                      type: string
                    target:
                      type: string
          responses:
            '201':
              description: Created
      /api/catalog/refresh:
        post:
          summary: Refresh entity
          requestBody:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    entityRef:
                      type: string
          responses:
            '200':
              description: Success
    security:
      - bearerAuth: []
    components:
      securitySchemes:
        bearerAuth:
          type: http
          scheme: bearer

---
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: backstage-scaffolder-api
  description: Scaffolder API - Launch templates and manage tasks
  tags:
    - scaffolder
    - templates
spec:
  type: openapi
  lifecycle: production
  owner: platform-team
  definition: |
    openapi: 3.0.0
    info:
      title: Backstage Scaffolder API
      version: 1.0.0
    servers:
      - url: https://poteatc-backstage-devspace-backend.apps.rm1.0a51.p1.openshiftapps.com
    paths:
      /api/scaffolder/v2/tasks:
        post:
          summary: Launch a template
          requestBody:
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    templateRef:
                      type: string
                    values:
                      type: object
          responses:
            '201':
              description: Task created
        get:
          summary: List tasks
          responses:
            '200':
              description: Success
      /api/scaffolder/v2/tasks/{taskId}:
        get:
          summary: Get task status
          parameters:
            - name: taskId
              in: path
              required: true
              schema:
                type: string
          responses:
            '200':
              description: Task details
    security:
      - bearerAuth: []
    components:
      securitySchemes:
        bearerAuth:
          type: http
          scheme: bearer
