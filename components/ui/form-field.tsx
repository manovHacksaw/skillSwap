import type React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface FormFieldProps {
  label: string
  error?: string
  success?: string
  required?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
  description?: string
}

export function FormField({
  label,
  error,
  success,
  required,
  loading,
  children,
  className,
  description,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        className={cn(
          "text-black font-bold flex items-center gap-2",
          required && "after:content-['*'] after:text-red-500 after:ml-1",
        )}
      >
        {label}
        {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
      </Label>

      {description && <p className="text-sm text-gray-600">{description}</p>}

      {children}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && !error && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  success?: string
  loading?: boolean
}

export function Input({ error, success, loading, className, ...props }: InputProps) {
  return (
    <div className="relative">
      <Input
        className={cn(
          "border-2 rounded-lg font-medium pr-10",
          error
            ? "border-red-500 focus:border-red-500"
            : success
              ? "border-green-500 focus:border-green-500"
              : "border-black",
          className,
        )}
        {...props}
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
      )}
      {success && !loading && !error && (
        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
      )}
      {error && !loading && (
        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
      )}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  success?: string
  maxLength?: number
}

export function EnhancedTextarea({ error, success, maxLength, className, value, ...props }: TextareaProps) {
  const currentLength = typeof value === "string" ? value.length : 0

  return (
    <div className="space-y-1">
      <Textarea
        className={cn(
          "border-2 rounded-lg font-medium",
          error
            ? "border-red-500 focus:border-red-500"
            : success
              ? "border-green-500 focus:border-green-500"
              : "border-black",
          className,
        )}
        value={value}
        {...props}
      />
      {maxLength && (
        <div className="flex justify-end">
          <span
            className={cn(
              "text-xs",
              currentLength > maxLength * 0.9 ? "text-orange-500" : "text-gray-500",
              currentLength >= maxLength ? "text-red-500" : "",
            )}
          >
            {currentLength}/{maxLength}
          </span>
        </div>
      )}
    </div>
  )
}
