import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import VinylCard from './VinylCard';
import { motion } from 'framer-motion';

const VinylList = ({ searchTerm = '', selectedGenreId = '', sortOption = 'name', sortOrder = 'asc' }) => {
  const [vinyls, setVinyls] = useState([]);
  const [artists, setArtists] = useState({});
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    const fetchArtistAndGenreNames = async (artistId, genreId) => {
      try {
        if (!artists[artistId]) {
          const artistDoc = await getDoc(doc(db, 'artist', artistId));
          if (artistDoc.exists()) {
            setArtists(prev => ({ ...prev, [artistId]: artistDoc.data().name }));
          }
        }

        if (!genres[genreId]) {
          const genreDoc = await getDoc(doc(db, 'genere', genreId));
          if (genreDoc.exists()) {
            setGenres(prev => ({ ...prev, [genreId]: genreDoc.data().name }));
          }
        }
      } catch (error) {
        console.error('Error al obtener datos de artista o género:', error);
      }
    };

    const fetchVinyls = async () => {
      try {
        const vinylsCollection = collection(db, 'vinyl');
        const vinylSnapshot = await getDocs(vinylsCollection);
        const vinylList = vinylSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        vinylList.forEach(vinyl => {
          const { 'artist-id': artistId, 'genre-id': genreId } = vinyl;
          if (artistId && genreId) {
            fetchArtistAndGenreNames(artistId, genreId);
          }
        });

        setVinyls(vinylList);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener vinilos:', error);
      }
    };

    fetchVinyls();
  }, [artists, genres]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Filtrar los vinilos según el término de búsqueda y el género seleccionado
  const filteredVinyls = vinyls.filter(vinyl => {
    const artistName = artists[vinyl['artist-id']]?.toLowerCase() || '';
    const vinylName = vinyl.name?.toLowerCase() || '';
    const genreId = vinyl['genre-id'];

    const matchesSearch =
      vinylName.includes(searchTerm.toLowerCase()) ||
      artistName.includes(searchTerm.toLowerCase());

    const matchesGenre = !selectedGenreId || genreId === selectedGenreId;

    return matchesSearch && matchesGenre;
  });

  // Ordenar vinilos
  const sortedVinyls = filteredVinyls.sort((a, b) => {
    const aVal = sortOption === 'name' ? a.name : sortOption === 'year' ? a['release-date'] : artists[a['artist-id']];
    const bVal = sortOption === 'name' ? b.name : sortOption === 'year' ? b['release-date'] : artists[b['artist-id']];

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <motion.div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {sortedVinyls.map((vinyl, index) => (
        <VinylCard key={vinyl.id} vinyl={vinyl} artist={artists[vinyl['artist-id']]} genre={genres[vinyl['genre-id']]} />
      ))}
    </motion.div>
  );
};

export default VinylList;
