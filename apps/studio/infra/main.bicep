targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Name of the resource group')
param resourceGroupName string = 'rg-${environmentName}'

// Authentication parameters
@secure()
@description('NextAuth secret for authentication')
param nextAuthSecret string

@description('NextAuth URL for authentication')
param nextAuthUrl string = 'https://localhost:3000'

// Supabase parameters
@secure()
@description('Supabase URL')
param supabaseUrl string

@secure()
@description('Supabase anonymous key')
param supabaseAnonKey string

// OpenAI parameters
@secure()
@description('OpenAI API key')
param openaiApiKey string

// Google Cloud parameters
@secure()
@description('Google Cloud project ID')
param googleCloudProject string

@secure()
@description('Google Cloud service account credentials')
param googleApplicationCredentials string

// Function app parameters
@secure()
@description('Azure Web Jobs Storage connection string')
param azureWebJobsStorage string = ''

@description('Functions worker runtime')
param functionsWorkerRuntime string = 'python'

// Create resource token for unique naming
var resourceToken = uniqueString(subscription().id, location, environmentName)
var resourcePrefix = 'os'

// Create resource group
resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: {
    'azd-env-name': environmentName
  }
}

// Create resources within the resource group
module resources 'resources.bicep' = {
  name: 'resources'
  scope: resourceGroup
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    resourcePrefix: resourcePrefix
    nextAuthSecret: nextAuthSecret
    nextAuthUrl: nextAuthUrl
    supabaseUrl: supabaseUrl
    supabaseAnonKey: supabaseAnonKey
    openaiApiKey: openaiApiKey
    googleCloudProject: googleCloudProject
    googleApplicationCredentials: googleApplicationCredentials
    azureWebJobsStorage: azureWebJobsStorage
    functionsWorkerRuntime: functionsWorkerRuntime
  }
}

// Outputs required by AZD
output RESOURCE_GROUP_ID string = resourceGroup.id
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_SUBSCRIPTION_ID string = subscription().subscriptionId

// Service-specific outputs
output STUDIO_URL string = resources.outputs.STUDIO_URL
output PATHWAYS_URL string = resources.outputs.PATHWAYS_URL
output API_URL string = resources.outputs.API_URL
output OPENAI_ENDPOINT string = resources.outputs.OPENAI_ENDPOINT
output AI_SERVICES_ENDPOINT string = resources.outputs.AI_SERVICES_ENDPOINT
