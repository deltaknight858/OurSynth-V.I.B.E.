
import { BaseEntity } from "@/types/database";

// Type for validation rules
type ValidationRule = {
  validator: (value: any) => boolean;
  message: string;
};

// Type for field validation rules
type FieldValidationRules = Record<string, ValidationRule[]>;

// Generic validation function
export function validateEntity<T extends BaseEntity>(entity: T): void {
  // Common validation rules for all entities
  if (!entity.id) {
    throw new Error("Entity ID is required");
  }
  
  if (!entity.createdAt || typeof entity.createdAt !== "number") {
    throw new Error("Entity createdAt must be a valid timestamp");
  }
  
  if (!entity.updatedAt || typeof entity.updatedAt !== "number") {
    throw new Error("Entity updatedAt must be a valid timestamp");
  }
  
  // Get entity-specific validation rules
  const rules = getValidationRules(entity);
  
  // Validate each field with its rules
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = entity[field as keyof T];
    
    for (const rule of fieldRules) {
      if (!rule.validator(value)) {
        throw new Error(`Validation error for ${field}: ${rule.message}`);
      }
    }
  }
}

// Get validation rules based on entity type
function getValidationRules(entity: BaseEntity): FieldValidationRules {
  // Common validation rules
  const commonRules: FieldValidationRules = {
    id: [
      {
        validator: (value) => typeof value === "string" && value.length > 0,
        message: "ID must be a non-empty string"
      }
    ],
    createdAt: [
      {
        validator: (value) => typeof value === "number" && value > 0,
        message: "createdAt must be a positive number"
      }
    ],
    updatedAt: [
      {
        validator: (value) => typeof value === "number" && value > 0,
        message: "updatedAt must be a positive number"
      }
    ]
  };
  
  // Determine entity type and add specific rules
  if ("userId" in entity && "email" in entity) {
    // UserProfile validation
    return {
      ...commonRules,
      userId: [
        {
          validator: (value) => typeof value === "string" && value.length > 0,
          message: "userId must be a non-empty string"
        }
      ],
      email: [
        {
          validator: (value) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: "email must be a valid email address"
        }
      ]
    };
  } else if ("name" in entity && "ownerId" in entity && "collaborators" in entity) {
    // Project validation
    return {
      ...commonRules,
      name: [
        {
          validator: (value) => typeof value === "string" && value.length > 0,
          message: "name must be a non-empty string"
        }
      ],
      ownerId: [
        {
          validator: (value) => typeof value === "string" && value.length > 0,
          message: "ownerId must be a non-empty string"
        }
      ],
      collaborators: [
        {
          validator: (value) => Array.isArray(value),
          message: "collaborators must be an array"
        }
      ]
    };
  } else if ("projectId" in entity && "title" in entity && "content" in entity) {
    // Document validation
    return {
      ...commonRules,
      projectId: [
        {
          validator: (value) => typeof value === "string" && value.length > 0,
          message: "projectId must be a non-empty string"
        }
      ],
      title: [
        {
          validator: (value) => typeof value === "string" && value.length > 0,
          message: "title must be a non-empty string"
        }
      ],
      content: [
        {
          validator: (value) => typeof value === "string",
          message: "content must be a string"
        }
      ]
    };
  } else if ("documentId" in entity && "content" in entity) {
    // Comment validation
    return {
      ...commonRules,
      documentId: [
        {
          validator: (value) => typeof value === "string" && value.length > 0,
          message: "documentId must be a non-empty string"
        }
      ],
      content: [
        {
          validator: (value) => typeof value === "string" && value.length > 0,
          message: "content must be a non-empty string"
        }
      ]
    };
  }
  
  // Default to common rules if entity type is not recognized
  return commonRules;
}

// String validation
export function validateString(value: any, minLength = 1, maxLength = 1000): boolean {
  return typeof value === "string" && value.length >= minLength && value.length <= maxLength;
}

// Number validation
export function validateNumber(value: any, min?: number, max?: number): boolean {
  if (typeof value !== "number") return false;
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

// Email validation
export function validateEmail(value: any): boolean {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Array validation
export function validateArray(value: any, minLength = 0, maxLength?: number): boolean {
  if (!Array.isArray(value)) return false;
  if (value.length < minLength) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;
  return true;
}

// Boolean validation
export function validateBoolean(value: any): boolean {
  return typeof value === "boolean";
}

// Object validation
export function validateObject(value: any): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Date validation
export function validateDate(value: any): boolean {
  if (typeof value === "number") {
    return !isNaN(value) && value > 0;
  }
  return false;
}
