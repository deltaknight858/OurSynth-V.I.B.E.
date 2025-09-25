# Terraform Configuration for VIBE Infrastructure

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azure = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 5.0"
    }
  }

  # Configure remote state (uncomment and configure for production)
  # backend "azurerm" {
  #   resource_group_name  = "vibe-terraform-state"
  #   storage_account_name = "vibeterraformstate"
  #   container_name      = "tfstate"
  #   key                = "vibe.terraform.tfstate"
  # }
}

# Configure providers
provider "azurerm" {
  features {}
}

provider "github" {
  # Configure with GITHUB_TOKEN environment variable
}

# Local variables
locals {
  environment = var.environment
  project_name = "vibe"
  
  # Resource naming convention
  naming_convention = "${local.project_name}-${local.environment}"
  
  # Common tags
  common_tags = {
    Project     = "VIBE"
    Environment = local.environment
    ManagedBy   = "Terraform"
    Owner       = "OurSynth"
  }
}

# Variables
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "East US 2"
}

variable "github_repository" {
  description = "GitHub repository for the project"
  type        = string
  default     = "oursynth/vibe"
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "${local.naming_convention}-rg"
  location = var.location
  tags     = local.common_tags
}

# TODO: Add specific infrastructure resources
# Examples of what would be included:

# Container App Environment
# resource "azurerm_container_app_environment" "main" {
#   name               = "${local.naming_convention}-cae"
#   location           = azurerm_resource_group.main.location
#   resource_group_name = azurerm_resource_group.main.name
#   
#   tags = local.common_tags
# }

# Container Apps for each VIBE application
# - Shell (main navigation)
# - Tracker (activity monitoring)
# - Memory (knowledge capsules)
# - Assist (AI agent interface)
# - etc.

# Azure Database for PostgreSQL (for capsule storage)
# resource "azurerm_postgresql_flexible_server" "main" {
#   name                = "${local.naming_convention}-postgres"
#   resource_group_name = azurerm_resource_group.main.name
#   location           = azurerm_resource_group.main.location
#   
#   administrator_login    = "vibeadmin"
#   administrator_password = var.database_password
#   
#   sku_name = "B_Standard_B1ms"
#   storage_mb = 32768
#   version = "14"
#   
#   tags = local.common_tags
# }

# Azure Cache for Redis (session management, caching)
# resource "azurerm_redis_cache" "main" {
#   name                = "${local.naming_convention}-redis"
#   location            = azurerm_resource_group.main.location
#   resource_group_name = azurerm_resource_group.main.name
#   capacity            = 0
#   family              = "C"
#   sku_name            = "Basic"
#   
#   tags = local.common_tags
# }

# Azure AI Services (for agent functionality)
# resource "azurerm_cognitive_account" "openai" {
#   name                = "${local.naming_convention}-openai"
#   location           = azurerm_resource_group.main.location
#   resource_group_name = azurerm_resource_group.main.name
#   kind               = "OpenAI"
#   sku_name          = "S0"
#   
#   tags = local.common_tags
# }

# Azure Storage Account (for static assets, backups)
# resource "azurerm_storage_account" "main" {
#   name                     = "${replace(local.naming_convention, "-", "")}storage"
#   resource_group_name      = azurerm_resource_group.main.name
#   location                = azurerm_resource_group.main.location
#   account_tier            = "Standard"
#   account_replication_type = "LRS"
#   
#   tags = local.common_tags
# }

# Application Insights (monitoring and analytics)
# resource "azurerm_application_insights" "main" {
#   name                = "${local.naming_convention}-insights"
#   location           = azurerm_resource_group.main.location
#   resource_group_name = azurerm_resource_group.main.name
#   application_type   = "web"
#   
#   tags = local.common_tags
# }

# Outputs
output "resource_group_name" {
  description = "Name of the created resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = azurerm_resource_group.main.location
}