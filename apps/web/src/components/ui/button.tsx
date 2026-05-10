import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button component variants using CVA (class-variance-authority).
 * Supports multiple visual styles and sizes for consistent UI patterns.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="lg">
 *   Click me
 * </Button>
 * ```
 */
const buttonVariants = cva(
  // Base styles: layout, typography, focus states, and disabled states
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg",
    "text-sm font-medium",
    // Focus visible states for keyboard navigation accessibility
    "ring-offset-background transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Disabled state: prevent interactions but maintain visual feedback
    "disabled:pointer-events-none disabled:opacity-50",
    // Child element styling (icons/SVGs)
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    // Interactive cursor
    "cursor-pointer",
  ].join(" "),
  {
    variants: {
      variant: {
        /**
         * Primary action button with filled background.
         * Use for main CTAs and primary actions.
         */
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80 hover:shadow-md",
        /**
         * Destructive action button (delete, remove).
         * Use for actions that cannot be undone.
         */
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/80",
        /**
         * Secondary outline button with border.
         * Use for secondary actions and alternatives.
         */
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-muted",
        /**
         * Secondary filled button.
         * Use for alternative actions with lower prominence than default.
         */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        /**
         * Ghost button with minimal styling.
         * Use for tertiary actions or navigation-like buttons.
         */
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-muted",
        /**
         * Text-only link button.
         * Use for inline links with button semantics.
         */
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Extracted variant type for consumer type-safety.
 * Allows consumers to define button variant types in their own code.
 */
export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]
export type ButtonSize = VariantProps<typeof buttonVariants>["size"]

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, the button will be rendered as a slot/wrapper component.
   * Useful for composing with other components (e.g., <Button asChild><a href="/">Link</a></Button>).
   */
  asChild?: boolean
  /**
   * Optional loading state. When true, button is disabled and should show loading indicator.
   * Consumer is responsible for managing loading UI (e.g., spinner, text change).
   */
  isLoading?: boolean
}

/**
 * Button component with flexible styling and composition support.
 *
 * Features:
 * - Multiple variants (default, destructive, outline, secondary, ghost, link)
 * - Multiple sizes (default, sm, lg, icon)
 * - Full accessibility support (focus states, disabled handling)
 * - Composition support via asChild prop
 * - Type-safe variant selection
 *
 * @param props - Standard HTML button attributes + custom Button props
 * @param ref - Forwarded ref to button element (or Slot component)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button onClick={handleClick}>Click me</Button>
 *
 * // With variant and size
 * <Button variant="destructive" size="lg">Delete</Button>
 *
 * // As a link
 * <Button asChild><a href="/home">Home</a></Button>
 *
 * // With loading state
 * <Button isLoading={loading}>
 *   {loading ? "Saving..." : "Save"}
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine component to render: native button or Slot (for composition)
    const Comp = asChild ? Slot : "button"

    // Merge disabled state with isLoading state
    const isDisabled = disabled || isLoading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }