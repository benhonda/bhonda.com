import { z } from "zod";
import type { FormConfig } from "../form-config-types";

/**
 * Example form configuration demonstrating various field types
 * 
 * This file serves as a template for creating form configurations.
 * Copy this file and modify it for your specific forms.
 */
export const exampleFormConfig = {
  // Text input field
  name: {
    type: "text",
    label: "Full Name",
    placeholder: "Enter your full name",
    schema: z.string().min(2, "Name must be at least 2 characters"),
  },

  // Email field with validation
  email: {
    type: "text",
    label: "Email Address",
    placeholder: "your@email.com",
    schema: z.string().email("Please enter a valid email"),
  },

  // Password field
  password: {
    type: "text",
    label: "Password",
    placeholder: "Enter a secure password",
    schema: z.string().min(8, "Password must be at least 8 characters"),
  },

  // Textarea field
  message: {
    type: "textarea",
    label: "Message",
    placeholder: "Tell us more about your request...",
    schema: z.string().min(10, "Message must be at least 10 characters"),
  },

  // Select dropdown
  category: {
    type: "select",
    label: "Category",
    placeholder: "Select a category",
    options: ["general", "support", "sales", "other"],
    mapToLabels: (key) => {
      switch (key) {
        case "general": return "General Inquiry";
        case "support": return "Technical Support";
        case "sales": return "Sales";
        case "other": return "Other";
        default: return key;
      }
    },
    schema: z.enum(["general", "support", "sales", "other"]),
  },

  // Checkbox field
  acceptTerms: {
    type: "singleCheckbox",
    label: "I accept the terms and conditions",
    schema: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  },

  // Radio group
  contactMethod: {
    type: "radioGroup",
    label: "Preferred Contact Method",
    options: ["email", "phone", "sms"],
    mapToLabels: (key) => {
      switch (key) {
        case "email": return "Email";
        case "phone": return "Phone";
        case "sms": return "SMS";
        default: return key;
      }
    },
    schema: z.enum(["email", "phone", "sms"]),
  },

  // Switch toggle
  newsletter: {
    type: "switch",
    label: "Subscribe to newsletter",
    schema: z.boolean().default(false),
  },

  // Date picker - use text input with date validation
  birthDate: {
    type: "text",
    label: "Date of Birth",
    placeholder: "YYYY-MM-DD",
    schema: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)"),
  },

  // Number input
  age: {
    type: "number",
    label: "Age",
    placeholder: "Enter your age",
    schema: z.number().min(18, "You must be at least 18 years old").max(120),
  },
} as const satisfies FormConfig;