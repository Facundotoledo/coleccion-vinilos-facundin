import React, { useState, useEffect } from 'react';
import VinylList from './components/VinylList';
import RandomVinylCard from './components/RandomVinylCard';
import { FaSearch, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import SearchBar from './components/Filters/SearchBar';
import SortControls from './components/Filters/SortControls';
import GenreFilter from './components/Filters/GenreFilter';
import RandomButton from './components/Shared/RandomButton';


const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [randomVinyl, setRandomVinyl] = useState(null);
  const [artists, setArtists] = useState({});
  const [showFavorites, setShowFavorites] = useState(false); 

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreSnapshot = await getDocs(collection(db, 'genere'));
        const genreList = genreSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setGenres(genreList);
      } catch (error) {
        console.error('Error al obtener géneros:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleSortChange = (option) => {
    if (sortOption === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortOrder('asc');
    }
  };

  const handleRandomVinyl = async () => {
    try {
      const vinylsSnapshot = await getDocs(collection(db, 'vinyl'));
      let vinylList = vinylsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filtro los vinilos según el filtro de búsqueda y género
      const filteredVinyls = vinylList.filter(vinyl => {
        const artistName = artists[vinyl['artist-id']]?.toLowerCase() || '';
        const vinylName = vinyl.name?.toLowerCase() || '';
        const genreId = vinyl['genre-id'];

        const matchesSearch =
          vinylName.includes(searchTerm.toLowerCase()) ||
          artistName.includes(searchTerm.toLowerCase());

        const matchesGenre = !selectedGenreId || genreId === selectedGenreId;

        return matchesSearch && matchesGenre;
      });

      // Seleccion de un vinilo aleatorio de los filtrados
      if (filteredVinyls.length > 0) {
        const random = filteredVinyls[Math.floor(Math.random() * filteredVinyls.length)];

        const [artistDoc, genreDoc] = await Promise.all([
          getDoc(doc(db, 'artist', random['artist-id'])),
          getDoc(doc(db, 'genere', random['genre-id']))
        ]);

        const artistName = artistDoc.exists() ? artistDoc.data().name : 'Artista desconocido';
        const genreName = genreDoc.exists() ? genreDoc.data().name : 'Género desconocido';

        setRandomVinyl({ ...random, artistName, genreName });
      } else {
        alert('No hay vinilos que coincidan con los filtros aplicados.');
      }
    } catch (error) {
      console.error('Error al obtener vinilo aleatorio:', error);
    }
  };

  const handleCloseRandomVinyl = () => setRandomVinyl(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-serif px-8 py-12">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-6xl font-bold text-white mr-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            COLECCIÓN DE VINILOS
          </h1>
          <img src="./vinyl.png" alt="Vinyl Record" className="w-24 h-24" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-12">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <GenreFilter selectedGenreId={selectedGenreId} setSelectedGenreId={setSelectedGenreId} genres={genres}/>
          <SortControls sortOption={sortOption} sortOrder={sortOrder} handleSortChange={handleSortChange} showFavorites={showFavorites} setShowFavorites={setShowFavorites} />
        </div>

        <RandomButton onClick={handleRandomVinyl} />
      </div>

      {randomVinyl && (
        <div className="max-w-7xl mx-auto mb-12 relative">
          <RandomVinylCard vinyl={randomVinyl} artistName={randomVinyl.artistName}  genreName={randomVinyl.genreName} onClose={handleCloseRandomVinyl} />
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-16">
        <VinylList searchTerm={searchTerm} selectedGenreId={selectedGenreId} sortOption={sortOption} sortOrder={sortOrder} showFavorites={showFavorites} />
      </div>

      <p className="text-xl font-light text-gray-400 text-center">by Facundin</p>
    </div>
  );
};

export default Home;
