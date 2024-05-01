import React from "react";
import { Typography, Box } from "@mui/material";
import useStyles from "./styles";
import Movie from "../Movie/Movie";

const FavoriteMovieCard = ({ favoriteMovies }) => {
  const classes = useStyles();
  return (
    <Box display="flex" flexWrap="wrap">
      {favoriteMovies?.results?.map((movie, i) => (
        <Movie movie={movie} i={i} key={movie.id} />
      ))}
    </Box>
  );
};

export default FavoriteMovieCard;
