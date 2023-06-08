import { useState } from 'react';

const ProductFilter = ({ products, colors, sizes, priceRanges, onFilter }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    min: priceRanges.min,
    max: priceRanges.max,
  });
  const [isOpen, setIsOpen] = useState(false); // State variable to track if the filter box is open or closed

  const handleColorChange = (color) => {
    const updatedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(updatedColors);
  };

  const handleSizeChange = (size) => {
    const updatedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(updatedSizes);
  };

  const handlePriceRangeChange = (event) => {
    const { name, value } = event.target;
    setSelectedPriceRange((prevRange) => ({
      ...prevRange,
      [name]: parseInt(value),
    }));
  };

  const filterProducts = () => {
    setIsOpen(false);
    const filteredProducts = products.filter((product) => {
      const { color, sizes, price } = product;
      const isColorMatched =
        selectedColors.length === 0 || selectedColors.includes(color);
      const isSizeMatched =
        selectedSizes.length === 0 ||
        selectedSizes.some((selectedSize) => sizes.includes(selectedSize));
      const isPriceMatched =
        price >= selectedPriceRange.min && price <= selectedPriceRange.max;

      return isColorMatched && isSizeMatched && isPriceMatched;
    });

    onFilter(filteredProducts);
  };

  const toggleFilterBox = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className="font-mono">
      <div className='fixed top-21 right-0 text-sm font-medium bg-gradient-to-br bg-wendge text-gray-200 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-lg p-2 focus:outline-none'>
        <h3 className='pl-0.25 mr-5'>Filter</h3>
        <button
          className="absolute top-1/2 transform -translate-y-1/2 right-0 pr-0.5 text-gray-200 hover:text-gray-700 focus:outline-none"
          onClick={toggleFilterBox}
        >
          {isOpen ? '' : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3.5 text-gray-200"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>

          )}
        </button>
      </div>
      {isOpen && (
        // Display filter box only if it's open
        <div className="fixed bottom-0 top-20 right-0 inset-0 overflow-hidden">
          <div className="fixed bg-blur top-0 right-0 bottom-0 left-0 flex overflow-y-auto max-h-300">
            <div className=" bg-transparent p-6 space-y-4 w-90">
              <div className="flex flex-col">
                <div className="flex justify-end items-center">   
                  <button onClick={toggleFilterBox} className="p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-black"
                      viewBox="0 0 20 20"
                      fill="black"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.646 2.646a.5.5 0 01.708 0L10 9.293l6.646-6.647a.5.5 0 11.708.708L10.707 10l6.647 6.646a.5.5 0 01-.708.708L10 10.707l-6.646 6.647a.5.5 0 01-.708-.708L9.293 10 2.646 3.354a.5.5 0 010-.708z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3 mt-2">Colors</h3>
                <div className="flex flex-wrap space-x-4">

                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`p-3 rounded-full text-black mt-3 text-opacity-70 ${selectedColors.includes(color)
                        ? 'bg-wendge text-white text-opacity-70'
                        : 'bg-gray-300 bg-opacity-50'
                        }`}
                      onClick={() => handleColorChange(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3 mt-2">Sizes</h3>
                <div className="flex flex-wrap space-x-4">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`p-3 rounded-full text-black mt-3 text-opacity-70 ${selectedSizes.includes(size)
                          ? 'bg-wendge text-white text-opacity-70'
                          : 'bg-gray-300 bg-opacity-50'
                        }`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 mt-2">Price Range</h3>
                <div className="flex space-x-2 space-y-4">
                  <span>{selectedPriceRange.min}</span>
                  <input
                    type="range"
                    name="min"
                    min={priceRanges.min}
                    max={priceRanges.max}
                    value={selectedPriceRange.min}
                    onChange={handlePriceRangeChange}
                    className="w-80 mt-2 bg-gradient-to-r from-gray-400 via-gray-500 to-wendge appearance-none h-1 focus:outline-none"
                  />
                </div>
                <div className="flex space-x-2 space-y-4 mt-3">
                  <span>{selectedPriceRange.max}</span>
                  <input
                    type="range"
                    name="max"
                    min={priceRanges.min}
                    max={priceRanges.max}
                    value={selectedPriceRange.max}
                    onChange={handlePriceRangeChange}
                    className="w-80 mt-2 mb-2 bg-gradient-to-r from-gray-400 via-gray-500 to-wendge appearance-none h-1 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className="px-11 py-3 text-white mt-3 text-opacity-70 bg-wendge rounded-full"
                  onClick={filterProducts}
                >
                  Apply Filters
                </button>
              </div>
  
            </div>
          </div>
        </div>


      )}
    </div>
  );
};

export default ProductFilter;
