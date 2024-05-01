import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  useMediaQuery,
  Typography,
} from "@mui/material";
//below we using it for currentgenreorcategory
import { useSelector } from "react-redux";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";

import { useGetMoviesQuery } from "../../services/TMDB";
import MovieList from "../MovieList/MovieList";
import Pagination from "../Pagination/Pagination";


const Movies = () => {
  //we need to pass page also for initial state for create slice
  const [page, setPage] = useState(1);
  //for genreOrCategory
  const { genreIdOrCategoryName, searchQuery } = useSelector(
    (state) => state.currentGenreOrCategory
  );

  const { data, error, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page,
    searchQuery,
  });

  //console.log(data);

  // whywe got this error???

  // react-refresh-runtime.development.js:315 Uncaught ReferenceError:
  // Cannot access 'genreIdOrCategoryName' before initialization
  //
  //  const { data, error, isFetching } = useGetMoviesQuery({
  //   genreIdOrCategoryName,
  // });
  ///if we added this after
  //   const { genreIdOrCategoryName } = useSelector(
  //   (state) => state.currentGenreOrCategory
  //   );
  // thts why we using it at top

  //for Fetching data and loading progress bar if not used you will get error
  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  //for error
  if (error) {
    return "An error has occured.";
  }

  //this is for search movies if we dont find movies in server
  if (!data.results.length) {
    return (
      <Box display="flex" alignItems="center" mt="20px">
        <Typography variant="h4">
          No movies that match that name.
          <br />
          Please search for something else.
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <MovieList movies={data} numberOfSlice={18} />
      {/* movies props ==> MovieList */}
      <Pagination
        currentPage={page}
        setPage={setPage}
        totalPages={data.total_pages}
      />
    </div>
  );
};

export default Movies;
