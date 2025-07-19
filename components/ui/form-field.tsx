import type React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn("text-black font-bold", required && "after:content-['*'] after:text-red-500 after:ml-1")}>
        {label}
      </Label>
      {children}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function ValidatedInput({ error, className, ...props }: ValidatedInputProps) {
  return (
    <Input
      className={cn(
        "border-2 rounded-lg font-medium",
        error ? "border-red-500 focus:border-red-500" : "border-black",
        className,
      )}
      {...props}
    />
  )
}

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export function ValidatedTextarea({ error, className, ...props }: ValidatedTextareaProps) {
  return (
    <Textarea
      className={cn(
        "border-2 rounded-lg font-medium",
        error ? "border-red-500 focus:border-red-500" : "border-black",
        className,
      )}
      {...props}
    />
  )
}
