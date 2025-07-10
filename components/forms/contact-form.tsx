'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useContactContent, useLocale } from '@/hooks/use-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { 
  Loader2, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  Check,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  Clock 
} from 'lucide-react'
import { 
  validateField,
  getValidationStrength,
  getLocalizedErrorMessage,
  contactFormSchema,
  createDebouncedValidator,
  type ContactFormData,
  type ValidationState,
  createInitialValidationState
} from '@/lib/validations'

interface ContactFormProps {
  className?: string
}

interface FormValidationStates {
  name: ValidationState
  email: ValidationState
  message: ValidationState
  preferredMethod: ValidationState
}

export function ContactForm({ className }: ContactFormProps) {
  const contactContent = useContactContent()
  const locale = useLocale()
  const { toast } = useToast()
  
  const [validationStates, setValidationStates] = useState<FormValidationStates>({
    name: createInitialValidationState(),
    email: createInitialValidationState(),
    message: createInitialValidationState(),
    preferredMethod: createInitialValidationState()
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)
  const [showValidationHints, setShowValidationHints] = useState(false)
  const [formStartTime] = useState(Date.now()) // Track when form was loaded
  const [honeypot, setHoneypot] = useState('') // Honeypot field for bot detection
  
  // Debounced validators for each field
  const debouncedValidators = useRef({
    name: createDebouncedValidator(validateField.name, 300),
    email: createDebouncedValidator(validateField.email, 300),
    message: createDebouncedValidator(validateField.message, 500),
    preferredMethod: createDebouncedValidator(validateField.preferredMethod, 100)
  })

  // Preferred contact method options
  const contactMethods = [
    {
      value: 'email',
      label: locale === 'sv' ? 'E-post' : 'Email',
      icon: Mail
    },
    {
      value: 'phone',
      label: locale === 'sv' ? 'Telefon' : 'Phone',
      icon: Phone
    },
    {
      value: 'meeting',
      label: locale === 'sv' ? 'Videomöte' : 'Video Meeting',
      icon: Calendar
    },
    {
      value: 'linkedin',
      label: 'LinkedIn',
      icon: MessageSquare
    }
  ]

  // Get form data from validation states
  const getFormData = (): ContactFormData => ({
    name: validationStates.name.value,
    email: validationStates.email.value,
    message: validationStates.message.value,
    preferredMethod: validationStates.preferredMethod.value as ContactFormData['preferredMethod']
  })

  // Check if form is valid
  const isFormValid = Object.values(validationStates).every(
    state => state.isValid === true && state.value.trim() !== ''
  )

  // Update validation state for a field
  const updateFieldValidation = useCallback((
    field: keyof FormValidationStates,
    updates: Partial<ValidationState>
  ) => {
    setValidationStates(prev => ({
      ...prev,
      [field]: { ...prev[field], ...updates }
    }))
  }, [])

  // Handle real-time validation for a field
  const handleFieldValidation = useCallback((
    field: keyof FormValidationStates,
    value: string,
    immediate: boolean = false
  ) => {
    // Set validating state
    updateFieldValidation(field, { 
      isValidating: !immediate,
      value,
      isDirty: true 
    })

    const validator = debouncedValidators.current[field]
    
    if (immediate) {
      // Immediate validation (on blur)
      const result = validateField[field](value)
      const localizedError = result.error 
        ? getLocalizedErrorMessage(result.error, locale as 'en' | 'sv')
        : null
      
      updateFieldValidation(field, {
        isValid: result.isValid,
        error: localizedError,
        isValidating: false,
        isTouched: true
      })
    } else {
      // Debounced validation (on change)
      validator(value, (result) => {
        const localizedError = result.error 
          ? getLocalizedErrorMessage(result.error, locale as 'en' | 'sv')
          : null
        
        updateFieldValidation(field, {
          isValid: result.isValid,
          error: localizedError,
          isValidating: false
        })
      })
    }
  }, [updateFieldValidation, locale])

  // Validate entire form
  const validateForm = (): boolean => {
    const formData = getFormData()
    
    try {
      contactFormSchema.parse(formData)
      return true
    } catch (error) {
      // Validate each field individually to show all errors
      Object.keys(validationStates).forEach(field => {
        const fieldKey = field as keyof FormValidationStates
        handleFieldValidation(fieldKey, validationStates[fieldKey].value, true)
      })
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !isFormValid) {
      setShowValidationHints(true)
      toast({
        title: locale === 'sv' ? '⚠️ Formuläret är ofullständigt' : '⚠️ Form Incomplete',
        description: locale === 'sv' 
          ? 'Vänligen fyll i alla fält korrekt innan du skickar.' 
          : 'Please complete all fields correctly before submitting.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitAttempts(prev => prev + 1)

    // Show loading toast for longer submissions
    const loadingToast = setTimeout(() => {
      if (isSubmitting) {
        toast({
          title: locale === 'sv' ? '📤 Skickar meddelande...' : '📤 Sending Message...',
          description: locale === 'sv' 
            ? 'Detta kan ta några sekunder.' 
            : 'This may take a few seconds.',
        })
      }
    }, 2000)

    try {
      const formData = getFormData()
      
      // Prepare submission data with security fields
      const submissionData = {
        ...formData,
        honeypot, // Should be empty for real users
        startTime: formStartTime.toString(), // Form load time for bot detection
        submissionTime: Date.now().toString()
      }
      
      // Submit to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        // Handle specific error cases with detailed feedback
        let errorMessage = ''
        let errorTitle = ''
        let recoveryActions: string[] = []
        
        if (response.status === 429) {
          errorTitle = locale === 'sv' ? '🚫 För många förfrågningar' : '🚫 Rate Limit Exceeded'
          errorMessage = locale === 'sv' 
            ? 'Du har skickat för många meddelanden. Försök igen om en stund.' 
            : 'You\'ve sent too many messages. Please try again in a while.'
          recoveryActions = [
            locale === 'sv' ? 'Vänta 15 minuter innan nästa försök' : 'Wait 15 minutes before trying again',
            locale === 'sv' ? 'Kontakta mig direkt via LinkedIn' : 'Contact me directly via LinkedIn'
          ]
        } else if (response.status >= 500) {
          errorTitle = locale === 'sv' ? '🔧 Server problem' : '🔧 Server Error'
          errorMessage = locale === 'sv' 
            ? 'Det finns ett tillfälligt problem med servern. Försök igen om en stund.' 
            : 'There\'s a temporary server issue. Please try again in a moment.'
          recoveryActions = [
            locale === 'sv' ? 'Försök igen om några minuter' : 'Try again in a few minutes',
            locale === 'sv' ? 'Kontakta mig direkt via e-post' : 'Contact me directly via email'
          ]
        } else if (response.status === 400) {
          errorTitle = locale === 'sv' ? '❌ Ogiltiga data' : '❌ Invalid Data'
          errorMessage = result.error || (locale === 'sv' 
            ? 'Formulärdata är ogiltig. Kontrollera dina uppgifter.' 
            : 'Form data is invalid. Please check your information.')
          recoveryActions = [
            locale === 'sv' ? 'Kontrollera alla fält och försök igen' : 'Check all fields and try again'
          ]
        } else {
          errorTitle = locale === 'sv' ? '⚠️ Något gick fel' : '⚠️ Something Went Wrong'
          errorMessage = result.error || (locale === 'sv' 
            ? 'Ett oväntat fel inträffade. Försök igen.' 
            : 'An unexpected error occurred. Please try again.')
          recoveryActions = [
            locale === 'sv' ? 'Försök igen' : 'Try again',
            locale === 'sv' ? 'Kontakta mig direkt' : 'Contact me directly'
          ]
        }
        
        setLastError(errorMessage)
        setSubmitStatus('error')
        
        // Show detailed error toast
        toast({
          title: errorTitle,
          description: `${errorMessage}\n\n${locale === 'sv' ? 'Förslagsvis:' : 'Suggestions:'}\n• ${recoveryActions.join('\n• ')}`,
          variant: 'destructive',
          duration: 8000,
        })
        
        throw new Error(errorMessage)
      }
      
      // Success handling
      clearTimeout(loadingToast)
      
      // Reset form on success
      setValidationStates({
        name: createInitialValidationState(),
        email: createInitialValidationState(),
        message: createInitialValidationState(),
        preferredMethod: createInitialValidationState()
      })
      setHoneypot('') // Reset honeypot
      setSubmitStatus('success')
      setShowValidationHints(false)
      setSubmitAttempts(0)
      setLastError(null)
      
      // Show success toast with auto-response confirmation
      toast({
        title: locale === 'sv' ? '✅ Meddelande skickat!' : '✅ Message Sent!',
        description: locale === 'sv' 
          ? 'Tack för ditt meddelande! Du får en bekräftelse via e-post inom kort.' 
          : 'Thank you for your message! You\'ll receive a confirmation email shortly.',
        duration: 6000,
      })
      
      // Additional success toast with response time and follow-up actions
      setTimeout(() => {
        toast({
          title: locale === 'sv' ? '📧 Automatisk bekräftelse skickad' : '📧 Auto-Confirmation Sent',
          description: locale === 'sv' 
            ? 'Kontrollera din inkorg för bekräftelse. Jag återkommer personligen inom 24 timmar.' 
            : 'Check your inbox for confirmation. I\'ll personally respond within 24 hours.',
          action: (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.open('https://linkedin.com/in/chrish-fernando', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              LinkedIn
            </Button>
          ),
          duration: 10000,
        })
      }, 2000)
      
      // Reset success message after 10 seconds
      setTimeout(() => setSubmitStatus('idle'), 10000)
      
    } catch (error) {
      clearTimeout(loadingToast)
      console.error('Form submission error:', error)
      
      if (submitStatus !== 'error') {
        setSubmitStatus('error')
        
        // Generic error toast if not handled above
        if (!lastError) {
          toast({
            title: locale === 'sv' ? '❌ Fel vid sändning' : '❌ Submission Failed',
            description: locale === 'sv' 
              ? 'Ett oväntat fel inträffade. Försök igen eller kontakta mig direkt.' 
              : 'An unexpected error occurred. Please try again or contact me directly.',
            variant: 'destructive',
            action: (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSubmit(e)}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {locale === 'sv' ? 'Försök igen' : 'Retry'}
              </Button>
            ),
            duration: 8000,
          })
        }
      }
      
      // Auto-hide error after 8 seconds
      setTimeout(() => setSubmitStatus('idle'), 8000)
    } finally {
      setIsSubmitting(false)
      clearTimeout(loadingToast)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof FormValidationStates, value: string) => {
    handleFieldValidation(field, value)
  }

  // Handle field blur
  const handleFieldBlur = (field: keyof FormValidationStates) => {
    const currentValue = validationStates[field].value
    handleFieldValidation(field, currentValue, true)
  }

  // Get field validation visual state
  const getFieldState = (field: keyof FormValidationStates) => {
    const state = validationStates[field]
    const strength = getValidationStrength(field, state.value)
    
    return {
      ...state,
      strength,
      showError: state.isTouched && state.isValid === false,
      showSuccess: state.isTouched && state.isValid === true && state.value.trim() !== '',
      showValidating: state.isValidating
    }
  }

  // Get overall form progress
  const getFormProgress = () => {
    const fields = Object.keys(validationStates) as (keyof FormValidationStates)[]
    const validFields = fields.filter(field => validationStates[field].isValid === true)
    return (validFields.length / fields.length) * 100
  }

  return (
    <Card className={`border-0 shadow-professional bg-card border border-border ${className}`}>
      <CardContent className="p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {locale === 'sv' ? 'Skicka ett meddelande' : 'Send a Message'}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {locale === 'sv' 
              ? 'Fyll i formuläret nedan så återkommer jag inom 24 timmar.' 
              : 'Fill out the form below and I\'ll get back to you within 24 hours.'}
          </p>
        </div>

        {/* Enhanced Success Alert */}
        {submitStatus === 'success' && (
          <Alert className="mb-6 border-success/20 bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              <div className="space-y-3">
                <p className="font-medium">{contactContent.form.successMessage}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-success/80">
                    <Mail className="h-3 w-3" />
                    {locale === 'sv' 
                      ? 'Automatisk bekräftelse skickad till din e-post' 
                      : 'Auto-confirmation sent to your email'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-success/80">
                    <Clock className="h-3 w-3" />
                    {locale === 'sv' 
                      ? 'Personlig svarstid: Inom 24 timmar' 
                      : 'Personal response time: Within 24 hours'}
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Error Alert with Recovery Options */}
        {submitStatus === 'error' && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive-foreground">
              <div className="space-y-3">
                <p className="font-medium">
                  {lastError || contactContent.form.errorMessage}
                </p>
                {submitAttempts > 1 && (
                  <p className="text-sm">
                    {locale === 'sv' 
                      ? `Försök ${submitAttempts} - Om problemet kvarstår, kontakta mig direkt.` 
                      : `Attempt ${submitAttempts} - If the problem persists, contact me directly.`}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => handleSubmit(e)}
                    disabled={isSubmitting}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    {locale === 'sv' ? 'Försök igen' : 'Try Again'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(`mailto:${contactContent.email}`, '_blank')}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    {locale === 'sv' ? 'E-posta direkt' : 'Email Directly'}
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Form Progress Indicator */}
        {showValidationHints && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {locale === 'sv' ? 'Formulärstatus' : 'Form Progress'}
              </span>
              <span className="text-sm font-medium text-foreground">
                {Math.round(getFormProgress())}%
              </span>
            </div>
            <Progress value={getFormProgress()} className="h-2" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field - hidden from users, bots might fill it */}
          <input
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              {contactContent.form.nameLabel}
              {getFieldState('name').showValidating && (
                <Loader2 className="inline-block ml-2 h-3 w-3 animate-spin" />
              )}
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                value={getFieldState('name').value}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleFieldBlur('name')}
                placeholder={locale === 'sv' ? 'Ditt fullständiga namn' : 'Your full name'}
                className={`pr-10 ${
                  getFieldState('name').showError 
                    ? 'border-destructive focus-visible:ring-destructive' 
                    : getFieldState('name').showSuccess 
                    ? 'border-success focus-visible:ring-success'
                    : ''
                }`}
                disabled={isSubmitting}
              />
              {/* Validation Status Icon */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {getFieldState('name').showSuccess && (
                  <Check className="h-4 w-4 text-success" />
                )}
                {getFieldState('name').showError && (
                  <X className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            {getFieldState('name').showError && getFieldState('name').error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldState('name').error}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              {contactContent.form.emailLabel}
              {getFieldState('email').showValidating && (
                <Loader2 className="inline-block ml-2 h-3 w-3 animate-spin" />
              )}
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={getFieldState('email').value}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                placeholder={locale === 'sv' ? 'din@email.com' : 'your@email.com'}
                className={`pr-10 ${
                  getFieldState('email').showError 
                    ? 'border-destructive focus-visible:ring-destructive' 
                    : getFieldState('email').showSuccess 
                    ? 'border-success focus-visible:ring-success'
                    : ''
                }`}
                disabled={isSubmitting}
              />
              {/* Validation Status Icon */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {getFieldState('email').showSuccess && (
                  <Check className="h-4 w-4 text-success" />
                )}
                {getFieldState('email').showError && (
                  <X className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            {getFieldState('email').showError && getFieldState('email').error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldState('email').error}
              </p>
            )}
          </div>

          {/* Preferred Contact Method */}
          <div className="space-y-2">
            <Label htmlFor="method" className="text-sm font-medium text-foreground">
              {contactContent.form.methodLabel}
              {getFieldState('preferredMethod').showValidating && (
                <Loader2 className="inline-block ml-2 h-3 w-3 animate-spin" />
              )}
            </Label>
            <div className="relative">
              <Select 
                value={getFieldState('preferredMethod').value} 
                onValueChange={(value) => handleInputChange('preferredMethod', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`${
                  getFieldState('preferredMethod').showError 
                    ? 'border-destructive focus:ring-destructive' 
                    : getFieldState('preferredMethod').showSuccess 
                    ? 'border-success focus:ring-success'
                    : ''
                }`}>
                  <SelectValue 
                    placeholder={locale === 'sv' ? 'Välj kontaktmetod' : 'Choose contact method'} 
                  />
                </SelectTrigger>
                <SelectContent>
                  {contactMethods.map((method) => {
                    const IconComponent = method.icon
                    return (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {method.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {/* Validation Status Icon */}
              {(getFieldState('preferredMethod').showSuccess || getFieldState('preferredMethod').showError) && (
                <div className="absolute inset-y-0 right-8 flex items-center pr-3">
                  {getFieldState('preferredMethod').showSuccess && (
                    <Check className="h-4 w-4 text-success" />
                  )}
                  {getFieldState('preferredMethod').showError && (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </div>
              )}
            </div>
            {getFieldState('preferredMethod').showError && getFieldState('preferredMethod').error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldState('preferredMethod').error}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="message" className="text-sm font-medium text-foreground">
                {contactContent.form.messageLabel}
                {getFieldState('message').showValidating && (
                  <Loader2 className="inline-block ml-2 h-3 w-3 animate-spin" />
                )}
              </Label>
              <span className="text-xs text-muted-foreground">
                {getFieldState('message').value.length}/5000
              </span>
            </div>
            <div className="relative">
              <Textarea
                id="message"
                value={getFieldState('message').value}
                onChange={(e) => handleInputChange('message', e.target.value)}
                onBlur={() => handleFieldBlur('message')}
                placeholder={locale === 'sv' 
                  ? 'Berätta om ditt projekt eller hur jag kan hjälpa dig...' 
                  : 'Tell me about your project or how I can help you...'}
                className={`min-h-[120px] resize-none ${
                  getFieldState('message').showError 
                    ? 'border-destructive focus-visible:ring-destructive' 
                    : getFieldState('message').showSuccess 
                    ? 'border-success focus-visible:ring-success'
                    : ''
                }`}
                disabled={isSubmitting}
              />
              {/* Validation Status Icon */}
              <div className="absolute top-3 right-3">
                {getFieldState('message').showSuccess && (
                  <Check className="h-4 w-4 text-success" />
                )}
                {getFieldState('message').showError && (
                  <X className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            {/* Message Strength Indicator */}
            {getFieldState('message').value.length > 0 && (
              <div className="flex items-center gap-2">
                <div className={`h-1 flex-1 rounded-full ${
                  getFieldState('message').strength.color === 'red' ? 'bg-destructive/20' :
                  getFieldState('message').strength.color === 'yellow' ? 'bg-accent/20' :
                  getFieldState('message').strength.color === 'green' ? 'bg-success/20' : 'bg-muted'
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      getFieldState('message').strength.color === 'red' ? 'bg-destructive' :
                      getFieldState('message').strength.color === 'yellow' ? 'bg-accent-foreground' :
                      getFieldState('message').strength.color === 'green' ? 'bg-success' : 'bg-muted-foreground'
                    }`}
                    style={{
                      width: `${Math.min((getFieldState('message').value.length / 200) * 100, 100)}%`
                    }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  getFieldState('message').strength.color === 'red' ? 'text-destructive' :
                  getFieldState('message').strength.color === 'yellow' ? 'text-accent-foreground' :
                  getFieldState('message').strength.color === 'green' ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {getFieldState('message').strength.strength === 'weak' ? (locale === 'sv' ? 'Svag' : 'Weak') :
                   getFieldState('message').strength.strength === 'fair' ? (locale === 'sv' ? 'Okej' : 'Fair') :
                   getFieldState('message').strength.strength === 'good' ? (locale === 'sv' ? 'Bra' : 'Good') :
                   getFieldState('message').strength.strength === 'excellent' ? (locale === 'sv' ? 'Utmärkt' : 'Excellent') : ''}
                </span>
              </div>
            )}
            {getFieldState('message').showError && getFieldState('message').error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldState('message').error}
              </p>
            )}
          </div>

          {/* Enhanced Submit Button */}
          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-4 min-h-[56px] text-base font-medium transition-all duration-200 touch-target-large ${
                isSubmitting 
                  ? 'bg-primary/80 text-primary-foreground cursor-wait' 
                  : isFormValid 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-professional hover:shadow-professional-lg transform hover:scale-105' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {locale === 'sv' ? 'Skickar meddelande...' : 'Sending message...'}
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {locale === 'sv' ? 'Meddelande skickat!' : 'Message sent!'}
                </>
              ) : isFormValid ? (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {contactContent.form.submitButton}
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {locale === 'sv' ? 'Fyll i alla fält' : 'Complete all fields'}
                </>
              )}
            </Button>
            
            {/* Loading Progress Indicator */}
            {isSubmitting && (
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  {locale === 'sv' 
                    ? 'Bearbetar din förfrågan...' 
                    : 'Processing your request...'}
                </div>
                <Progress value={50} className="h-1" />
              </div>
            )}
            
            {/* Retry Button for Errors */}
            {submitStatus === 'error' && !isSubmitting && (
              <Button
                variant="outline"
                onClick={(e) => handleSubmit(e)}
                className="w-full min-h-[48px] border-destructive/30 text-destructive hover:bg-destructive/10 touch-target"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {locale === 'sv' ? 'Försök skicka igen' : 'Try sending again'}
              </Button>
            )}
          </div>
          
          {/* Form Help Text */}
          {!isFormValid && showValidationHints && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {locale === 'sv' 
                  ? 'Fyll i alla fält korrekt för att skicka meddelandet' 
                  : 'Complete all fields correctly to send your message'}
              </p>
            </div>
          )}
        </form>

        {/* Additional Information */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            {locale === 'sv' 
              ? 'Dina uppgifter behandlas konfidentiellt och kommer inte delas med tredje part.' 
              : 'Your information is treated confidentially and will not be shared with third parties.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 