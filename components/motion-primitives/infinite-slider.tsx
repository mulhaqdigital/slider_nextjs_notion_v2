'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface InfiniteSliderProps {
    children: React.ReactNode[]
    speed?: number
    speedOnHover?: number
    gap?: number
    mobileGap?: number
}

export function InfiniteSlider({
    children,
    speed = 50,
    speedOnHover = speed / 2,
    gap = 20,
    mobileGap = 12,
}: InfiniteSliderProps) {
    const [itemsWidth, setItemsWidth] = useState(0)
    const [currentGap, setCurrentGap] = useState(gap)
    const [currentSpeed, setCurrentSpeed] = useState(speed)
    
    const wrapperRef = useRef<HTMLDivElement>(null)
    const itemsRef = useRef<HTMLDivElement>(null)

    // Update measurements and responsive gap on mount and window resize
    useEffect(() => {
        const updateMeasurements = () => {
            if (wrapperRef.current && itemsRef.current) {
                setItemsWidth(itemsRef.current.offsetWidth)
                
                // Set gap based on screen width
                const isMobile = window.innerWidth < 768
                setCurrentGap(isMobile ? mobileGap : gap)
            }
        }
        
        updateMeasurements()
        
        window.addEventListener('resize', updateMeasurements)
        return () => window.removeEventListener('resize', updateMeasurements)
    }, [gap, mobileGap])

    const baseX = useMotionValue(0)
    const springX = useSpring(baseX, {
        damping: 50,
        stiffness: 400,
    })

    const x = useTransform(springX, (value: number) => `${value}px`)

    useAnimationFrame((time: number) => {
        const timeOffset = (time * currentSpeed) / 5000
        const newX = -timeOffset % (itemsWidth + (currentGap * children.length))
        baseX.set(newX)
    })

    return (
        <div
            ref={wrapperRef}
            className="flex overflow-hidden"
        >
            <motion.div
                ref={itemsRef}
                style={{ x }}
                className="flex"
                onHoverStart={() => setCurrentSpeed(speedOnHover)}
                onHoverEnd={() => setCurrentSpeed(speed)}
            >
                {children.map((child, index) => (
                    <div key={index} style={{ marginRight: index === children.length - 1 ? 0 : currentGap }}>
                        {child}
                    </div>
                ))}
                {children.map((child, index) => (
                    <div key={`dup-${index}`} style={{ marginRight: index === children.length - 1 ? 0 : currentGap }}>
                        {child}
                    </div>
                ))}
            </motion.div>
        </div>
    )
}