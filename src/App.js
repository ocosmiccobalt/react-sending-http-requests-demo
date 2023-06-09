import { Fragment, useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [recentlyAdded, setRecentlyAdded] = useState(0);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-23-default-rtdb.firebaseio.com/movies.json');

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }

      setMovies(loadedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);
  // }, [fetchMoviesHandler, recentlyAdded]);

  async function addMovieHandler(movie) {
    setError(null);
    try {
      const response = await fetch('https://react-http-23-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      console.log(data);
      // setRecentlyAdded((prevAdded) => ++prevAdded);

      // instead of calling fetchMoviesHandler every time when a movie is added:
      const addedMovie = {
        id: data.name, // firebase-specific => "name" contains generated id
        ...movie
      };
      setMovies((prevMovies) => prevMovies.concat(addedMovie));
    } catch (error) {
      setError(error.message);
    }
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button type='button' onClick={fetchMoviesHandler}>
          Fetch Movies
        </button>
      </section>
      <section>{content}</section>
    </Fragment>
  );
};
export default App;
