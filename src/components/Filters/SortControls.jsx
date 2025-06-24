import React from 'react';
import { FaArrowUp, FaArrowDown, FaHeart, FaRegHeart } from 'react-icons/fa';

const SortControls = ({ sortOption, sortOrder, handleSortChange, showFavorites, setShowFavorites }) => {
  return (
    <div className="flex items-center gap-4 w-full h-full">
      <select
        value={sortOption}
        onChange={(e) => handleSortChange(e.target.value)}
        className="w-full h-full py-3 px-4 rounded-xl bg-gray-800 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
        aria-label="Ordenar por"
      >
        <option value="name">Nombre</option>
        <option value="year">Año</option>
        <option value="artist">Artista</option>
      </select>

      <button
        onClick={() => handleSortChange(sortOption)}
        className="h-full py-3 px-4 rounded-xl bg-gray-800 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
        aria-label="Cambiar orden"
        style={{ minWidth: '48px' }}
      >
        {sortOrder === 'asc' ? <FaArrowDown /> : <FaArrowUp />}
      </button>

      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className={`h-full w-32 py-3 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg flex items-center gap-2 overflow-hidden truncate ${
          showFavorites ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-white'
        }`}
        aria-label="Mostrar favoritos"
        style={{ minWidth: '140px' }}
      >
        {showFavorites ? <FaHeart className="text-red-400" /> : <FaRegHeart />}
        <span className="truncate">Favoritos</span>
      </button>
    </div>
  );
};

export default SortControls;
