import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const VinylCard = ({ vinyl, artistName, genreName, onFavoriteChange }) => {
  const [isLiked, setIsLiked] = useState(vinyl.isLiked || false); 
  const releaseDate = vinyl['release-date'] ? vinyl['release-date'].split("-") : [];

  const toggleFavorite = async (e) => {
    e.stopPropagation(); 
    try {
      const vinylRef = doc(db, 'vinyl', vinyl.id);
      const newIsLiked = !isLiked;
      await updateDoc(vinylRef, { isLiked: newIsLiked });
      setIsLiked(newIsLiked); 
      if (onFavoriteChange) onFavoriteChange(vinyl.id, newIsLiked); 
    } catch (error) {
      console.error('Error al actualizar el estado de favorito:', error);
    }
  };

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex ${vinyl.expanded ? 'flex-row' : 'flex-col'} ${vinyl.expanded ? 'h-full' : ''}`}
      style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
    >
      <div className={`aspect-square ${vinyl.expanded ? 'w-1/2' : 'w-full'} overflow-hidden`}>
        <img
          src={vinyl.coverImageUrl}
          alt={`${vinyl.name} cover`}
          className="w-full h-full object-cover"
        />
      </div>

      
      <div className={`p-4 ${vinyl.expanded ? 'w-1/2' : 'w-full'} flex flex-col text-gray-800`}>
        
        {vinyl.expanded ? (
          <>
            <h3 className="text-3xl font-bold mb-2">{vinyl.name}</h3>
            <p className="text-xl text-gray-700 mb-4">{artistName || 'Cargando artista...'}</p>

            <p className="text-base text-gray-700 mb-6 text-justify">{vinyl.description || 'Descripción no disponible.'}</p>

            <div className={`mt-auto text-sm text-gray-500 flex flex-wrap justify-between items-center`}>
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
                <button onClick={(e) => toggleFavorite(e)} className="text-red-500 text-xl focus:outline-none">
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold">{vinyl.name}</h3>
            <p className="text-sm mt-2">{artistName || 'Cargando artista...'}</p>
            <p className="text-xs mt-1 text-gray-500">
              {genreName || 'Cargando género...'} · {releaseDate[2] || 'Fecha no disponible'}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default VinylCard;
