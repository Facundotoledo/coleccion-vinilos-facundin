import React from 'react';
import { motion } from 'framer-motion';

const VinylCard = ({ vinyl, artistName, genreName }) => {
  const releaseDate = vinyl['release-date'] ? vinyl['release-date'].split("-") : [];

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex ${vinyl.expanded ? 'flex-row' : 'flex-col'} ${vinyl.expanded ? 'h-full' : ''}`}
      style={{ fontFamily: 'Roboto Condensed, sans-serif' }} // Aplicando la fuente aquí
    >
      {/* Imagen del vinilo */}
      <div className={`aspect-square ${vinyl.expanded ? 'w-1/2' : 'w-full'} overflow-hidden`}>
        <img
          src={vinyl.coverImageUrl}
          alt={`${vinyl.name} cover`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Información */}
      <div className={`p-4 ${vinyl.expanded ? 'w-1/2' : 'w-full'} flex flex-col text-gray-800`}>
        {/* Expandido */}
        {vinyl.expanded ? (
          <>
            <h3 className="text-3xl font-bold mb-2">{vinyl.name}</h3>
            <p className="text-xl text-gray-700 mb-4">{artistName || 'Cargando artista...'}</p>

            <p className="text-base text-gray-700 mb-6 text-justify">{vinyl.description || 'Descripción no disponible.'}</p>

            <div className="mt-auto text-sm text-gray-500">
              <p><strong>Género:</strong> {genreName || 'Género no disponible'}</p>
              <p><strong>Fecha de Lanzamiento:</strong> {releaseDate.length === 3 ? `${releaseDate[0]}/${releaseDate[1]}/${releaseDate[2]}` : 'Fecha no disponible'}</p>
            </div>

            {/* Botones de Apple Music y Spotify */}
            <div className="flex gap-4 mt-4">
              {vinyl['apple-music'] && (
                <a href={vinyl['apple-music']} target="_blank" rel="noopener noreferrer">
                  <img src="./apple-music.svg" alt="Apple Music" className="w-8 h-8" />
                </a>
              )}
              {vinyl.spotify && (
                <a href={vinyl.spotify} target="_blank" rel="noopener noreferrer">
                  <img src="./spotify.svg" alt="Spotify" className="w-8 h-8" />
                </a>
              )}
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
