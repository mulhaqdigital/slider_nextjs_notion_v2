'use client'

interface ProgressiveBlurProps {
    className?: string
    direction?: 'left' | 'right'
    blurIntensity?: number
}

export function ProgressiveBlur({
    className = '',
    direction = 'left',
    blurIntensity = 1,
}: ProgressiveBlurProps) {
    const gradientDirection = direction === 'left' ? 'to right' : 'to left'
    
    return (
        <div
            className={className}
            style={{
                background: `linear-gradient(${gradientDirection}, 
                    rgba(255, 255, 255, ${blurIntensity}) 0%,
                    rgba(255, 255, 255, 0) 100%
                )`,
            }}
        />
    )
} 