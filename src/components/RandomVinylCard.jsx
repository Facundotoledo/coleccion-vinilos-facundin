import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';

const RandomVinylCard = ({ vinyl, artistName, genreName, onClose }) => {
  const releaseDate = vinyl['release-date'] ? vinyl['release-date'].split("-") : [];

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-row h-full"
      style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
    >
      {/* Cruz para cerrar la tarjeta */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2"
      >
        <FaTimes />
      </button>

      {/* Imagen del vinilo */}
      <div className="aspect-square w-1/2 overflow-hidden">
        <img
          src={vinyl.coverImageUrl}
          alt={`${vinyl.name} cover`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Información del vinilo */}
      <div className="p-4 w-1/2 flex flex-col text-gray-800">
        <h3 className="text-3xl font-bold mb-2">{vinyl.name}</h3>
        <p className="text-xl text-gray-700 mb-4">{artistName || 'Cargando artista...'}</p>

        <p className="text-base text-gray-700 mb-6 text-justify">{vinyl.description || 'Descripción no disponible.'}</p>

        <div className="mt-auto text-sm text-gray-500 flex flex-wrap justify-between items-center">
          <div className="mb-2 sm:mb-0">
            <p><strong>Género:</strong> {genreName || 'Género no disponible'}</p>
            <p><strong>Fecha de Lanzamiento:</strong> {releaseDate.length === 3 ? `${releaseDate[0]}/${releaseDate[1]}/${releaseDate[2]}` : 'Fecha no disponible'}</p>
          </div>
          <div className="flex gap-4 items-center">
            {vinyl['apple-music'] && (
              <a href={vinyl['apple-music']} target="_blank" rel="noopener noreferrer">
                <img src="./apple-music.svg" alt="Apple Music" className="w-6 h-6" />
              </a>
            )}
            {vinyl.spotify && (
              <a href={vinyl.spotify} target="_blank" rel="noopener noreferrer">
                <img src="./spotify-icon.svg" alt="Spotify" className="w-6 h-6" />
              </a>
            )}
            <button className="text-red-500 text-xl focus:outline-none">
              {vinyl.isLiked ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RandomVinylCard;
