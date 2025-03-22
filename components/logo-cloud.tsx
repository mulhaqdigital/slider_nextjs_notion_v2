import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import Image from 'next/image'

export default function LogoCloud() {
    const logos = [
        {
            src: "https://html.tailus.io/blocks/customers/nvidia.svg",
            alt: "Nvidia Logo",
            height: 20,
            className: "h-4"
        },
        
        {
            src: "https://cdn.worldvectorlogo.com/logos/nextjs-13.svg",
            alt: "nextjs Logo",
            height: 15,
            className: "h-4"
        },
        {
            src: "https://html.tailus.io/blocks/customers/github.svg",
            alt: "GitHub Logo",
            height: 16,
            className: "h-4"
        },
        {
            src: "https://svgmix.com/uploads/e11fe3-react.svg",
            alt: "react Logo",
            height: 25,
            className: "h-6"
        },
        {
            src: "https://html.tailus.io/blocks/customers/vercel.svg",
            alt: "Vercel Logo",
            height: 20,
            className: "h-4"
        },
        
        {
            src: "https://html.tailus.io/blocks/customers/laravel.svg",
            alt: "Laravel Logo",
            height: 16,
            className: "h-3"
        },
        {
            src: "https://library.shadcnblocks.com/images/block/logos/shadcn-ui-wordmark.svg",
            alt: "shadcn Logo",
            height: 16,
            className: "h-6"
        }
    ];

    return (
        <section className="bg-background overflow-hidden py-0 sm:py-0 md:py-0 lg:py-0">
            <div className="group relative m-0 max-w-7xl px-3 sm:px-4 md:px-6">
                <div className="flex flex-col items-center space-y-3 sm:space-y-4 md:space-y-0 md:flex-row">
                    <div className="w-full max-w-full text-center 
                        sm:max-w-[200px] md:max-w-60 md:text-left md:border-r md:pr-6">
                        <p className="text-xs sm:text-sm md:text-end">
                            Powering the best teams
                        </p>
                    </div>
                    
                    <div className="max-w-screen py-1 sm:py-1 md:py-1 w-full 
                        md:w-[calc(100%-11rem)] lg:w-[calc(100%-12rem)]">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={100}
                            gap={0}
                            mobileGap={48}>
                            {logos.map((logo, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-center w-14 md:w-20 last:mr-10"
                                >
                                    <Image
                                        className={`w-fit dark:invert ${logo.className}`}
                                        src={logo.src}
                                        alt={logo.alt}
                                        height={logo.height}
                                        width={logo.height * 2}
                                        priority={index < 3}
                                    />
                                </div>
                            ))}
                        </InfiniteSlider>

                        <div className="absolute inset-y-0 left-0 w-8 sm:w-10 md:w-12 lg:w-20 
                            bg-gradient-to-r from-background"></div>
                        <div className="absolute inset-y-0 right-0 w-8 sm:w-10 md:w-12 lg:w-20 
                            bg-gradient-to-l from-background"></div>
                        
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full 
                                w-8 sm:w-10 md:w-12 lg:w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full 
                                w-8 sm:w-10 md:w-12 lg:w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}