import React from "react";
import { Grid } from "@mui/material";

import useStyles from "./styles";
import Movie from "../Movie/Movie";

const ActorMovieList = ({ actorMovies,numberOfSlice }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.moviesContainer}>
      {actorMovies?.results.slice(0,numberOfSlice).map((movie, i) => (
        <Movie key={i} movie={movie} i={i} />
        ))}
    </Grid>
      
  );
};

export default ActorMovieList;
