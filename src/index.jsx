import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VinylList from './components/VinylList';
import RandomVinylCard from './components/RandomVinylCard';
import CreateVinyl from './pages/CreateVinyl'; // Import the new page
import { FaSearch, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [randomVinyl, setRandomVinyl] = useState(null);
  const [artists, setArtists] = useState({});
  const [showFavorites, setShowFavorites] = useState(false); // New state for filtering favorites

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

      // Filtrar los vinilos según el filtro de búsqueda y género
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

      // Seleccionar un vinilo aleatorio de los filtrados
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

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative mb-8">
          <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o artista..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 text-white text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <select
              value={selectedGenreId}
              onChange={e => setSelectedGenreId(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-gray-800 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            >
              <option value="">Todos los géneros</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-6">
            <select
              value={sortOption}
              onChange={e => handleSortChange(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-gray-800 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            >
              <option value="name">Nombre</option>
              <option value="year">Año</option>
              <option value="artist">Artista</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="py-3 px-4 rounded-xl bg-gray-800 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {sortOrder === 'asc' ? <FaArrowDown /> : <FaArrowUp />}
            </button>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`py-3 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg ${
                showFavorites ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-white'
              }`}
            >
              Favoritos
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="w-full py-3 px-4 rounded-xl bg-gray-800 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg flex justify-between items-center"
            onClick={handleRandomVinyl}
          >
            <span>Escuchar Vinilo Aleatorio</span>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
              <path d="M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z"></path>
            </svg>
          </button>
        </div>
      </div>

      {randomVinyl && (
        <div className="max-w-7xl mx-auto mb-12 relative">
          <RandomVinylCard
            vinyl={randomVinyl}
            artistName={randomVinyl.artistName}
            genreName={randomVinyl.genreName}
            onClose={handleCloseRandomVinyl}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-16">
        <VinylList
          searchTerm={searchTerm}
          selectedGenreId={selectedGenreId}
          sortOption={sortOption}
          sortOrder={sortOrder}
          showFavorites={showFavorites} // Pass the new state
        />
      </div>

      <p className="text-xl font-light text-gray-400 text-center">by Facundin</p>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-vinyl" element={<CreateVinyl />} /> {/* Add this route */}
    </Routes>
  </Router>
);

export default App;