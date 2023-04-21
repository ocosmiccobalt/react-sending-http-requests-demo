import { Fragment, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

const App = () => {
  const [movies, setMovies] = useState([]);

  async function fetchMoviesHandler() {
    const response = await fetch('https://swapi.dev/api/films/');
    const data = await response.json();

    const transformedMovies = data.results.map((movieData) => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date
      };
    });

    setMovies(transformedMovies);
  }

  return (
    <Fragment>
      <section>
        <button type='button' onClick={fetchMoviesHandler}>
          Fetch Movies
        </button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </Fragment>
  );
};
export default App;
