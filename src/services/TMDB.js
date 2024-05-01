import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;
//https://api.themoviedb.org/3/movie/popular?language=en-US&page=1

export const tmdbApi = createApi({
  reducerPath: "tbdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.themoviedb.org/3" }),
  endpoints: (builder) => ({
    //*GET genre list
    getGenres: builder.query({
      query: () => {
        return `/genre/movie/list?language=en&api_key=${tmdbApiKey}`;
      },
    }),

    //*GET movies by [Type]
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page, searchQuery }) => {
        //GET MOVIES BY SEARCH
        //'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1'
        if (searchQuery) {
          return `/search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`;
        }

        // GET MOVIES BY CATEGORY
        //popular,top_rated,upcoming -> string
        if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === "string"
        ) {
          return `movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbApiKey}`;
        }

        // GET MOVIES BY GENRE
        //12,33,45 -> number
        if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === "number"
        ) {
          //'discover/movie?&with_genres=14'
          return `discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${tmdbApiKey}`;
        }

        // GET POPULAR MOVIES
        return `/movie/popular?${page}&api_key=${tmdbApiKey}`;
      },
    }),
    //GET SINGLE MOVIE deatils with append request
    getMovie: builder.query({
      query: (id) => {
        return `/movie/${id}?append_to_response=videos,images,credits&api_key=${tmdbApiKey}`;
        //https://api.themoviedb.org/3/movie/157336?api_key=13a0087e2037c8190055be779d27b461&append_to_response=videos,images
        /*
          Imagine you're asking a friend for information about a movie. Instead of asking one question at a time like, "Tell me about the movie," 
          then separately asking, "Any cool videos in it?" and "Who are the actors?" you can ask everything in one go.

          So, append_to_response is like saying, "Give me details about the movie, and oh, by the way, include information about videos and credits in the same answer."
          It saves you from making multiple requests and gets you all the info you need at once.
          */
      },
    }),

    //GET LIST FOR FAV AND WATCHLIST
    getFavorite: builder.query({
      query: ({ accountId, sessionId, page }) => {
        //account/${accountId}/favorite/movies?page=${page}&session_id=${sessionId}&api_key=${tmdbApiKey}'
        return `/account/${accountId}/favorite/movies?page=${page}&session_id=${sessionId}&api_key=${tmdbApiKey}`;
      },
    }),

    getWatchlist: builder.query({
      query: ({ accountId, sessionId, page }) => {
        //account/${accountId}/favorite/movies?page=${page}&session_id=${sessionId}&api_key=${tmdbApiKey}'
        return `/account/${accountId}/watchlist/movies?page=${page}&session_id=${sessionId}&api_key=${tmdbApiKey}`;
      },
    }),

    getRecommendations: builder.query({
      query: ({ movie_id }) => {
        return `/movie/${movie_id}/recommendations?language=en-US&api_key=${tmdbApiKey}`;
      },
    }),

    //FOR ACTORS DETAILS
    getActors: builder.query({
      query: (id) => {
        //https://api.themoviedb.org/3/person/${person_id}
        return `/person/${id}?api_key=${tmdbApiKey}`;
      },
    }),

    //FOR ACTORS DETAILS
    getActorMovie: builder.query({
      query: ({ id, page }) => {
        ///person/1190668/movie_credits?language=en-US'
        // either use this but u wont see page number
        // return `/person/${person_id}/movie_credits?language=en-US'&api_key=${tmdbApiKey}`;

        //OR
        // `/discover/movie?with_cast=${person_id}&page=${page}&&api_key=${tmdbApiKey}`
        return `/discover/movie?with_cast=${id}&page=${page}&api_key=${tmdbApiKey}`;
      },
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetMoviesQuery,
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetActorsQuery,
  useGetActorMovieQuery,
  useGetFavoriteQuery,
  useGetWatchlistQuery,
} = tmdbApi;
