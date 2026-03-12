import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import Image from 'next/image'

export default function LogoCloud() {
    const logos = [
        { src: 'https://cdn.simpleicons.org/nvidia',      alt: 'Nvidia',    className: 'h-[21px]' },
        { src: 'https://cdn.simpleicons.org/nextdotjs',   alt: 'Next.js',   className: 'h-[21px]' },
        { src: 'https://cdn.simpleicons.org/github',      alt: 'GitHub',    className: 'h-[25px]' },
        { src: 'https://cdn.simpleicons.org/react',       alt: 'React',     className: 'h-[29px]' },
        { src: 'https://cdn.simpleicons.org/vercel',      alt: 'Vercel',    className: 'h-[21px]' },
        { src: 'https://cdn.simpleicons.org/laravel',     alt: 'Laravel',   className: 'h-[25px]' },
        { src: 'https://cdn.simpleicons.org/tailwindcss', alt: 'Tailwind',  className: 'h-[21px]' },
        { src: 'https://cdn.simpleicons.org/typescript',  alt: 'TypeScript',className: 'h-[25px]' },
        { src: 'https://cdn.simpleicons.org/notion',      alt: 'Notion',    className: 'h-[25px]' },
    ];

    return (
        <section className="bg-background overflow-hidden py-2">
            <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
                <InfiniteSlider speed={60} gap={0} mobileGap={48}>
                    {logos.map((logo) => (
                        <div
                            key={logo.alt}
                            className="flex items-center justify-center w-14 md:w-20"
                        >
                            <Image
                                className={`w-auto dark:invert ${logo.className}`}
                                src={logo.src}
                                alt={logo.alt}
                                height={29}
                                width={29}
                                unoptimized
                            />
                        </div>
                    ))}
                </InfiniteSlider>

                <div className="absolute inset-y-0 left-0 w-8 sm:w-10 md:w-12 lg:w-20 bg-gradient-to-r from-background pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-8 sm:w-10 md:w-12 lg:w-20 bg-gradient-to-l from-background pointer-events-none"></div>

                <ProgressiveBlur
                    className="pointer-events-none absolute left-0 top-0 h-full w-8 sm:w-10 md:w-12 lg:w-20"
                    direction="left"
                    blurIntensity={1}
                />
                <ProgressiveBlur
                    className="pointer-events-none absolute right-0 top-0 h-full w-8 sm:w-10 md:w-12 lg:w-20"
                    direction="right"
                    blurIntensity={1}
                />
            </div>
        </section>
    )
}
