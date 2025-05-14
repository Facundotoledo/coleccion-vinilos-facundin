import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, doc, getDoc, query, orderBy, startAfter, limit } from 'firebase/firestore';
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
  const [lastVisible, setLastVisible] = useState(null); // Para paginación
  const [hasMore, setHasMore] = useState(true); // Indica si hay más datos para cargar
  const observer = useRef(null); // Referencia para el scroll infinito

  const ITEMS_PER_PAGE = 12;

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

  const fetchVinyls = async (isInitialLoad = false) => {
    try {
      setLoading(true);
      const vinylsCollection = collection(db, 'vinyl');
      let vinylQuery = query(
        vinylsCollection,
        orderBy('name'),
        startAfter(lastVisible || 0),
        limit(ITEMS_PER_PAGE)
      );

      const vinylSnapshot = await getDocs(vinylQuery);
      const vinylList = vinylSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      vinylList.forEach(vinyl => {
        const { 'artist-id': artistId, 'genre-id': genreId } = vinyl;
        if (artistId && genreId) {
          fetchArtistAndGenreNames(artistId, genreId);
        }
      });

      if (vinylSnapshot.docs.length < ITEMS_PER_PAGE) {
        setHasMore(false); // No hay más datos para cargar
      }

      setLastVisible(vinylSnapshot.docs[vinylSnapshot.docs.length - 1]); // Actualizar el último documento visible
      setVinyls(prev => (isInitialLoad ? vinylList : [...prev, ...vinylList]));
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener vinilos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVinyls(true); // Cargar los primeros datos
  }, []);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      fetchVinyls(); // Cargar más datos cuando el usuario llega al final
    }
  };

  useEffect(() => {
    const options = { root: null, rootMargin: '0px', threshold: 1.0 };
    observer.current = new IntersectionObserver(handleObserver, options);
    const target = document.querySelector('#load-more-trigger');
    if (target) observer.current.observe(target);

    return () => observer.current && observer.current.disconnect();
  }, [hasMore, loading]);

  if (loading && vinyls.length === 0) {
    return <div className="text-center mt-10 text-lg">Cargando vinilos...</div>;
  }

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-').map(Number); // Ajustado para "dd-mm-yyyy"
    return { year, month, day };
  };

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

  const sortedVinyls = filteredVinyls.sort((a, b) => {
    let aValue = '';
    let bValue = '';

    switch (sortOption) {
      case 'year':
        const aDate = parseDate(a['release-date']);
        const bDate = parseDate(b['release-date']);
        if (aDate.year !== bDate.year) {
          return sortOrder === 'asc' ? aDate.year - bDate.year : bDate.year - aDate.year;
        } else if (aDate.month !== bDate.month) {
          return sortOrder === 'asc' ? aDate.month - bDate.month : bDate.month - aDate.month;
        } else {
          return sortOrder === 'asc' ? aDate.day - bDate.day : bDate.day - aDate.day;
        }
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'artist':
        aValue = artists[a['artist-id']]?.toLowerCase() || '';
        bValue = artists[b['artist-id']]?.toLowerCase() || '';
        break;
      default:
        break;
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Mostrar tarjetas y expandida correctamente en filas
  const elements = [];
  for (let i = 0; i < sortedVinyls.length; i += columns) {
    const rowVinyls = sortedVinyls.slice(i, i + columns);

    if (
      expandedIndex !== null &&
      expandedIndex >= i &&
      expandedIndex < i + columns
    ) {
      const expandedVinyl = sortedVinyls[expandedIndex];
      elements.push(
        <motion.div
          key={'expanded-' + expandedIndex}
          layout
          className="col-span-full"
          onClick={() => setExpandedIndex(null)}
        >
          <VinylCard
            vinyl={{ ...expandedVinyl, expanded: true }}
            artistName={artists[expandedVinyl['artist-id']]}
            genreName={genres[expandedVinyl['genre-id']]}
          />
        </motion.div>
      );
    }

    rowVinyls.forEach((vinyl, indexInRow) => {
      const realIndex = i + indexInRow;
      if (realIndex === expandedIndex) return;

      elements.push(
        <motion.div
          key={realIndex}
          layout
          onClick={() => setExpandedIndex(realIndex)}
        >
          <VinylCard
            vinyl={{ ...vinyl, expanded: false }}
            artistName={artists[vinyl['artist-id']]}
            genreName={genres[vinyl['genre-id']]}
          />
        </motion.div>
      );
    });
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {elements}
      </div>
      {hasMore && (
        <div id="load-more-trigger" className="text-center mt-10">
          {loading ? 'Cargando más vinilos...' : ''}
        </div>
      )}
    </div>
  );
};

export default VinylList;
