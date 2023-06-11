import moment from 'moment'
import React from 'react'

function Order({ id, amount, items, timestamp, images }) {
    return (
        <div className='relative border rounded-md items-center'>
            <div className='flex items-center space-x-10 p-5 text-xs text-gray-700  rounded-lg'>
                <div>
                    <p className='font-bold text-xs'>Order Placed</p>
                    <p>{moment.unix(timestamp).format("DD MMM YYYY")}</p>
                </div>
                <div>
                    <p className='text-xs font-bold'>Total</p>
                    <p>{`₹ ${amount}`}</p>
                </div>
                <p className='text-sm self-end flex-1 text-right mr-10 text-wendge font-semibold'>{items ? items.length : 0} items</p>
                <p className='absolute top-2 right-0 w-40 items-center text-gray-700 truncate text-xs whitespace-nowrap'>
                    ORDER # {id}
                </p>
            </div>
            <div className='p-5 sm:p-10'>
                <div className='flex space-x-6 overflow-x-auto'>
                    {images.map(image => (
                        <img key={Math.random()} src={image} alt="image" className='h-20 object-contain sm:h-32' />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Order
