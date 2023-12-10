import React, { useState } from 'react'

function SearchBar({onSearch}) {
    const [searchTerm,setSearchTerm] = useState('')
    const handleSearch = () => {
        // Pass the search term to the parent component
        onSearch(searchTerm);
      };
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchBar
