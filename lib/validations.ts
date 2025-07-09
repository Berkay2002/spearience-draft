import { z } from 'zod'

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),
  
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  
  preferredMethod: z
    .enum(['email', 'phone', 'meeting', 'linkedin'], {
      required_error: 'Please select a preferred contact method',
      invalid_type_error: 'Please select a valid contact method'
    })
})

// Type inference from schema
export type ContactFormData = z.infer<typeof contactFormSchema>

// Individual field validation functions for real-time validation
export const validateField = {
  name: (value: string) => {
    try {
      contactFormSchema.shape.name.parse(value)
      return { isValid: true, error: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'Invalid name' }
      }
      return { isValid: false, error: 'Invalid name' }
    }
  },

  email: (value: string) => {
    try {
      contactFormSchema.shape.email.parse(value)
      return { isValid: true, error: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'Invalid email' }
      }
      return { isValid: false, error: 'Invalid email' }
    }
  },

  message: (value: string) => {
    try {
      contactFormSchema.shape.message.parse(value)
      return { isValid: true, error: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'Invalid message' }
      }
      return { isValid: false, error: 'Invalid message' }
    }
  },

  preferredMethod: (value: string) => {
    try {
      contactFormSchema.shape.preferredMethod.parse(value)
      return { isValid: true, error: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0]?.message || 'Invalid contact method' }
      }
      return { isValid: false, error: 'Invalid contact method' }
    }
  }
}

// Debounced validation hook utility
export const createDebouncedValidator = (
  validatorFn: (value: string) => { isValid: boolean; error: string | null },
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (
    value: string,
    callback: (result: { isValid: boolean; error: string | null }) => void
  ) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      const result = validatorFn(value)
      callback(result)
    }, delay)
  }
}

// Validation state type for enhanced UI feedback
export interface ValidationState {
  value: string
  isValid: boolean | null // null = not validated yet
  error: string | null
  isValidating: boolean
  isDirty: boolean // has user interacted with field
  isTouched: boolean // has user focused and left field
}

// Initial validation state factory
export const createInitialValidationState = (initialValue: string = ''): ValidationState => ({
  value: initialValue,
  isValid: null,
  error: null,
  isValidating: false,
  isDirty: false,
  isTouched: false
})

// Validation strength levels for better UX
export const getValidationStrength = (field: keyof ContactFormData, value: string) => {
  if (!value.trim()) return { strength: 'empty', color: 'gray' }

  switch (field) {
    case 'name':
      if (value.length < 2) return { strength: 'weak', color: 'red' }
      if (value.length < 5) return { strength: 'fair', color: 'yellow' }
      if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) return { strength: 'invalid', color: 'red' }
      return { strength: 'good', color: 'green' }

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return { strength: 'invalid', color: 'red' }
      if (value.length > 5 && emailRegex.test(value)) return { strength: 'good', color: 'green' }
      return { strength: 'fair', color: 'yellow' }

    case 'message':
      if (value.length < 10) return { strength: 'weak', color: 'red' }
      if (value.length < 50) return { strength: 'fair', color: 'yellow' }
      if (value.length < 200) return { strength: 'good', color: 'green' }
      return { strength: 'excellent', color: 'green' }

    case 'preferredMethod':
      const validMethods = ['email', 'phone', 'meeting', 'linkedin']
      return validMethods.includes(value) 
        ? { strength: 'good', color: 'green' }
        : { strength: 'invalid', color: 'red' }

    default:
      return { strength: 'unknown', color: 'gray' }
  }
}

// Localized error messages
export const getLocalizedErrorMessage = (error: string, locale: 'en' | 'sv'): string => {
  const errorMessages: Record<string, Record<'en' | 'sv', string>> = {
    'Name is required': {
      en: 'Name is required',
      sv: 'Namn krävs'
    },
    'Name must be at least 2 characters': {
      en: 'Name must be at least 2 characters',
      sv: 'Namnet måste vara minst 2 tecken'
    },
    'Name must be less than 100 characters': {
      en: 'Name must be less than 100 characters',
      sv: 'Namnet får vara högst 100 tecken'
    },
    'Name can only contain letters, spaces, hyphens, and apostrophes': {
      en: 'Name can only contain letters, spaces, hyphens, and apostrophes',
      sv: 'Namnet får bara innehålla bokstäver, mellanslag, bindestreck och apostrofer'
    },
    'Email is required': {
      en: 'Email is required',
      sv: 'E-post krävs'
    },
    'Please enter a valid email address': {
      en: 'Please enter a valid email address',
      sv: 'Ange en giltig e-postadress'
    },
    'Email must be less than 255 characters': {
      en: 'Email must be less than 255 characters',
      sv: 'E-posten får vara högst 255 tecken'
    },
    'Message is required': {
      en: 'Message is required',
      sv: 'Meddelande krävs'
    },
    'Message must be at least 10 characters': {
      en: 'Message must be at least 10 characters',
      sv: 'Meddelandet måste vara minst 10 tecken'
    },
    'Message must be less than 5000 characters': {
      en: 'Message must be less than 5000 characters',
      sv: 'Meddelandet får vara högst 5000 tecken'
    },
    'Please select a preferred contact method': {
      en: 'Please select a preferred contact method',
      sv: 'Välj en föredragen kontaktmetod'
    },
    'Please select a valid contact method': {
      en: 'Please select a valid contact method',
      sv: 'Välj en giltig kontaktmetod'
    }
  }

  return errorMessages[error]?.[locale] || error
} 