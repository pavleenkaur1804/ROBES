import axios from 'axios';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';


const SizeSelector = ({ productId, sizes, item, onChange }) => {
  try{
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    onChange(size);
  };
  const { data: session } = useSession()
  useEffect(() => {
    /* For Realtime updates of collection count */
 
    if (session) {
      const updateSize = async () => {
        try {
          await axios.post('api/updateSize', { session, productId, selectedSize: item.selectedSize, sizes })
        } catch (err) {
          console.log('err', err)
        }
      };
      updateSize();

    }

  }, [selectedSize]);
  return (
    <div className="flex items-center"
    >
      <span className="mr-2 text-sm">Select Size:</span>
      {sizes.map((size) => (
        <button
          key={size}
          className={`text-sm px-2 py-1 ml-2 rounded ${
            size === item.selectedSize ? 'bg-gray-700 text-white' : 'bg-gray-200'
          }`}
          onClick={(event) => {
            handleSizeSelect(size)
          }
            
          }
        >
          {size}
        </button>
      ))}
    
    </div>
  );
  } catch(err){
console.log('err', err)
  }
};

export default SizeSelector;
