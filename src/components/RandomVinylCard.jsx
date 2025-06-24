import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const RandomVinylCard = ({ vinyl, artistName, genreName, onClose }) => {
  const releaseDate = vinyl['release-date'] ? vinyl['release-date'].split("-") : [];

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-row h-full"
      style={{ fontFamily: 'Roboto Condensed, sans-serif' }} 
    >
      
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2"
      >
        <FaTimes />
      </button>

     
      <div className="aspect-square w-1/2 overflow-hidden">
        <img
          src={vinyl.coverImageUrl}
          alt={`${vinyl.name} cover`}
          className="w-full h-full object-cover"
        />
      </div>

      
      <div className="p-4 w-1/2 flex flex-col text-gray-800">
        <h3 className="text-3xl font-bold mb-2">{vinyl.name}</h3>
        <p className="text-xl text-gray-700 mb-4">{artistName || 'Cargando artista...'}</p>
        <p className="text-base text-gray-700 mb-6 text-justify">{vinyl.description || 'Descripción no disponible.'}</p>

        <div className="mt-auto text-sm text-gray-500">
          <p><strong>Género:</strong> {genreName || 'Género no disponible'}</p>
          <p><strong>Fecha de Lanzamiento:</strong> {releaseDate.length === 3 ? `${releaseDate[0]}/${releaseDate[1]}/${releaseDate[2]}` : 'Fecha no disponible'}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RandomVinylCard;
