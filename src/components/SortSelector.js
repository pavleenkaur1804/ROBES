const SortSelector = ({ sort, selectedSort, onChange }) => {
    return (
      <div className="fixed top-28 right-0 text-gray-200">
        <select 
          className="text-sm text-gray-200 font-medium bg-wendge bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-1 py-2 px-2 focus:outline-none"
          value={selectedSort}
          onChange={onChange}
        >
          {sort.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
    </div>
    
    );
  };
  
  export default SortSelector;