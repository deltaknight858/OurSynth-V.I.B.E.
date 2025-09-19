@description('Primary location for all resources')
param location string

@description('Environment name')
param environmentName string

@description('Resource token for unique naming')
param resourceToken string

@description('Resource prefix')
param resourcePrefix string

// Authentication parameters
@secure()
param nextAuthSecret string
param nextAuthUrl string

// Supabase parameters
@secure()
param supabaseUrl string
@secure()
param supabaseAnonKey string

// OpenAI parameters
@secure()
param openaiApiKey string

// Google Cloud parameters
@secure()
param googleCloudProject string
@secure()
param googleApplicationCredentials string

// Function app parameters
@secure()
param azureWebJobsStorage string
param functionsWorkerRuntime string

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'az-${resourcePrefix}-log-${resourceToken}'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Application Insights
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'az-${resourcePrefix}-ai-${resourceToken}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// User-assigned managed identity
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'az-${resourcePrefix}-mi-${resourceToken}'
  location: location
  tags: {
    'azd-env-name': environmentName
  }
}

// Key Vault for secrets
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: 'az-${resourcePrefix}-kv-${resourceToken}'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: tenant().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: false
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Storage Account for Function Apps
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'az${resourcePrefix}st${resourceToken}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Role assignments for managed identity to storage account
resource storageRoleAssignments 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for roleDef in [
  'b7e6dc6d-f1e8-4753-8033-0f276bb0955b' // Storage Blob Data Owner
  'ba92f5b4-2d11-453d-a403-e96b0029c9fe' // Storage Blob Data Contributor  
  '974c5e8b-45b9-4653-ba55-5f855dd0fb88' // Storage Queue Data Contributor
  '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3' // Storage Table Data Contributor
]: {
  name: guid(storageAccount.id, managedIdentity.id, roleDef)
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleDef)
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}]

// Monitoring role assignment
resource monitoringRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, managedIdentity.id, '3913510d-42f4-4e42-8a64-420c390055eb')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '3913510d-42f4-4e42-8a64-420c390055eb') // Monitoring Metrics Publisher
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// App Service Plan for Function Apps
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'az-${resourcePrefix}-asp-${resourceToken}'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {
    reserved: true
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Function App for API
resource functionApp 'Microsoft.Web/sites@2023-12-01' = {
  name: 'az-${resourcePrefix}-func-${resourceToken}'
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'Python|3.11'
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: azureWebJobsStorage != '' ? azureWebJobsStorage : 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: functionsWorkerRuntime
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsights.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
      ]
    }
    httpsOnly: true
  }
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'api'
  }
}

// Diagnostic settings for Function App
resource functionAppDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'functionAppDiagnostics'
  scope: functionApp
  properties: {
    workspaceId: logAnalyticsWorkspace.id
    logs: [
      {
        category: 'FunctionAppLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

// OpenAI Service
resource openAIService 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: 'az-${resourcePrefix}-oai-${resourceToken}'
  location: location
  sku: {
    name: 'S0'
  }
  kind: 'OpenAI'
  properties: {
    customSubDomainName: 'az-${resourcePrefix}-oai-${resourceToken}'
    networkAcls: {
      defaultAction: 'Allow'
    }
    publicNetworkAccess: 'Enabled'
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// AI Services (for Vertex AI integration)
resource aiServices 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: 'az-${resourcePrefix}-ais-${resourceToken}'
  location: location
  sku: {
    name: 'S0'
  }
  kind: 'AIServices'
  properties: {
    customSubDomainName: 'az-${resourcePrefix}-ais-${resourceToken}'
    networkAcls: {
      defaultAction: 'Allow'
    }
    publicNetworkAccess: 'Enabled'
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Static Web App for Studio
resource studioStaticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: 'az-${resourcePrefix}-swa-studio-${resourceToken}'
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'studio'
  }
}

// Static Web App for Pathways
resource pathwaysStaticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: 'az-${resourcePrefix}-swa-pathways-${resourceToken}'
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'pathways'
  }
}

// Studio Static Web App Configuration
resource studioConfig 'Microsoft.Web/staticSites/config@2023-12-01' = {
  parent: studioStaticWebApp
  name: 'appsettings'
  properties: {
    NEXTAUTH_SECRET: nextAuthSecret
    NEXTAUTH_URL: nextAuthUrl
    SUPABASE_URL: supabaseUrl
    SUPABASE_ANON_KEY: supabaseAnonKey
    NEXT_PUBLIC_API_URL: 'https://${functionApp.properties.defaultHostName}/api'
    APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsights.properties.ConnectionString
  }
}

// Pathways Static Web App Configuration
resource pathwaysConfig 'Microsoft.Web/staticSites/config@2023-12-01' = {
  parent: pathwaysStaticWebApp
  name: 'appsettings'
  properties: {
    NEXTAUTH_SECRET: nextAuthSecret
    OPENAI_API_KEY: openaiApiKey
    GOOGLE_CLOUD_PROJECT: googleCloudProject
    GOOGLE_APPLICATION_CREDENTIALS: googleApplicationCredentials
    AZURE_OPENAI_ENDPOINT: openAIService.properties.endpoint
    AZURE_OPENAI_API_KEY: openAIService.listKeys().key1
    APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsights.properties.ConnectionString
  }
}

// Outputs
output STUDIO_URL string = 'https://${studioStaticWebApp.properties.defaultHostname}'
output PATHWAYS_URL string = 'https://${pathwaysStaticWebApp.properties.defaultHostname}'
output API_URL string = 'https://${functionApp.properties.defaultHostName}'
output OPENAI_ENDPOINT string = openAIService.properties.endpoint
output AI_SERVICES_ENDPOINT string = aiServices.properties.endpoint
output APPLICATION_INSIGHTS_CONNECTION_STRING string = applicationInsights.properties.ConnectionString
output KEY_VAULT_URI string = keyVault.properties.vaultUri
