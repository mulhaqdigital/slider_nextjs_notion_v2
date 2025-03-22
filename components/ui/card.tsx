/**
 * Card Component Library
 * A collection of composable card components built with React and Tailwind CSS.
 * These components are part of the shadcn/ui library and follow a compound component pattern.
 * 
 * @module
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 * ```
 */

import * as React from "react"
import { cn } from "@/lib/utils" // Utility for merging Tailwind classes

/**
 * Base Card Component
 * The root container for the card pattern
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes
 * 
 * Styling:
 * - Flex container with column direction
 * - Rounded corners (xl)
 * - Border and shadow
 * - Background and text colors from theme
 * - Consistent padding
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card" // For styling targeting
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card Header Component
 * Container for the card's header section, typically containing title and description
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes
 * 
 * Styling:
 * - Flex column layout
 * - Consistent gap between elements
 * - Horizontal padding
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  )
}

/**
 * Card Title Component
 * Main heading element of the card
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes
 * 
 * Styling:
 * - Semi-bold font weight
 * - Adjusted line height
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Card Description Component
 * Secondary text element, typically used for supporting information
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes
 * 
 * Styling:
 * - Muted text color
 * - Smaller font size
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * Card Content Component
 * Main content area of the card
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes
 * 
 * Styling:
 * - Consistent horizontal padding
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * Card Footer Component
 * Bottom section of the card, typically used for actions or metadata
 * 
 * @component
 * @param {React.ComponentProps<"div">} props - Standard div element props
 * @param {string} [props.className] - Additional CSS classes
 * 
 * Styling:
 * - Flex container for alignment
 * - Consistent horizontal padding
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

/**
 * Usage Notes:
 * 
 * Layout Structure:
 * - Card: Main container
 *   - CardHeader: Top section
 *     - CardTitle: Main heading
 *     - CardDescription: Supporting text
 *   - CardContent: Main content area
 *   - CardFooter: Bottom section
 * 
 * Styling Customization:
 * - All components accept className prop for custom styles
 * - Uses cn() utility for class merging
 * - Follows Tailwind CSS conventions
 * 
 * Accessibility:
 * - Semantic HTML structure
 * - data-slot attributes for targeting
 * 
 * Theme Integration:
 * - Uses theme variables for colors
 * - Supports dark mode through Tailwind
 * 
 * Common Modifications:
 * - Adjust padding/margin through className
 * - Modify border radius
 * - Change background colors
 * - Customize shadow effects
 * 
 * Example with all components:
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Main content goes here
 *   </CardContent>
 *   <CardFooter>
 *     Footer content
 *   </CardFooter>
 * </Card>
 * ```
 */
