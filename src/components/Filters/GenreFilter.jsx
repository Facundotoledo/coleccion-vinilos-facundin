import React from 'react';

const GenreFilter = ({ selectedGenreId, setSelectedGenreId, genres }) => {
  return (
    <div className="w-full h-full flex items-center">
      <select
        value={selectedGenreId}
        onChange={(e) => setSelectedGenreId(e.target.value)}
        className="w-full h-full py-3 px-4 rounded-xl bg-gray-800 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
        aria-label="Filtrar por género"
      >
        <option value="">Todos los géneros</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreFilter;
