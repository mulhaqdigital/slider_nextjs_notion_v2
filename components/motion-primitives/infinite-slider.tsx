'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion'

interface InfiniteSliderProps {
    children: React.ReactNode[]
    speed?: number
    gap?: number
    mobileGap?: number
}

export function InfiniteSlider({
    children,
    speed = 50,
    gap = 20,
    mobileGap = 12,
}: InfiniteSliderProps) {
    const [singleWidth, setSingleWidth] = useState(0)
    const [currentGap, setCurrentGap] = useState(gap)

    const wrapperRef = useRef<HTMLDivElement>(null)
    const firstSetRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const update = () => {
            if (firstSetRef.current) {
                setSingleWidth(firstSetRef.current.offsetWidth)
            }
            const isMobile = window.innerWidth < 768
            setCurrentGap(isMobile ? mobileGap : gap)
        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [gap, mobileGap])

    const baseX = useMotionValue(0)
    const x = useTransform(baseX, (v) => `${v}px`)

    useAnimationFrame((time) => {
        if (!singleWidth) return
        const loopWidth = singleWidth + currentGap * children.length
        const offset = ((time * speed) / 5000) % loopWidth
        baseX.set(-offset)
    })

    const renderItems = (keySuffix: string) => (
        <div ref={keySuffix === 'a' ? firstSetRef : undefined} className="flex">
            {children.map((child, i) => (
                <div key={`${keySuffix}-${i}`} style={{ marginRight: i === children.length - 1 ? 0 : currentGap }}>
                    {child}
                </div>
            ))}
        </div>
    )

    return (
        <div ref={wrapperRef} className="flex overflow-hidden">
            <motion.div style={{ x }} className="flex">
                {renderItems('a')}
                {renderItems('b')}
                {renderItems('c')}
            </motion.div>
        </div>
    )
}
