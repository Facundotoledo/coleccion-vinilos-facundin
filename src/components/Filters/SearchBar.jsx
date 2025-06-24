import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-8">
      <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder="Buscar por nombre o artista..."
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 text-white text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Buscar vinilos"
      />
    </div>
  );
};

export default SearchBar;