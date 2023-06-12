import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"

export default function Banner({images, height, width, className }) {
    return (
        <div className={`relative ${`h-${height} w-${width}`} ${className}`}>
            <div className='absolute w-80 h-32 bottom-0'/>
            <Carousel
                autoPlay
                infiniteLoop
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                interval={3000}>
                <div>
                    <img src={images[0]} alt='Banner Image' />
                </div>
                <div>
                    <img src={images[1]} alt='Banner Image' />
                </div>
                <div>
                    <img src={images[2]} alt='Banner Image' />
                </div>
            </Carousel>
        </div>

    )
}
