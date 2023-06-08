import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"

export default function Banner({images, height, width, className }) {
    return (
        <div className={`relative ${`h-${height} w-${width}`} ${className}`}>
            <div className='absolute w-full h-32 bottom-0'/>
            <Carousel
                autoPlay
                infiniteLoop
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                interval={3000}>
                <div>
                    <img loading='lazy' src={images[0]} alt='' />
                </div>
                <div>
                    <img loading='lazy' src={images[1]} alt='' />
                </div>
                <div>
                    <img loading='lazy' src={images[2]} alt='' />
                </div>
            </Carousel>
        </div>

    )
}
