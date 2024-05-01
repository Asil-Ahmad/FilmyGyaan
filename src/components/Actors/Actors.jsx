import React from "react";
import { Typography, Grid, Box, CircularProgress, Button } from "@mui/material";

import { Link, useParams, useHistory } from "react-router-dom";
//we gonna useHistory

import { useGetActorsQuery, useGetActorMovieQuery } from "../../services/TMDB";

import ActorMovieList from "../MovieList/ActorMovieList";

import { ArrowBack } from "@mui/icons-material";

const Actors = () => {
  const { id } = useParams();
  const history = useHistory();
  const page = 1;

  const { data, isFetching, error } = useGetActorsQuery(id);

  const { data: actorMovies} =
    useGetActorMovieQuery({ id, page });

  console.log("Actor Movies", actorMovies);

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }
  if (error) {
    <Box display="flex" justifyContent="center">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => history.goBack()}
        color="primary"
      >
        Go Back
      </Button>
    </Box>;
  }

  return (
    <div>
     
      <img
        src={`https://image.tmdb.org/t/p/w500/${data?.profile_path}`}
        alt=""
      />

      <h1>{data?.name}</h1>
      {/* <h2>Born : {data.biography.split("(born")[1].split(")")[0]}</h2> */}
      <h2>Born : {new Date(data?.birthday).toDateString()}</h2>
      <p>{data.biography}</p>

      <a href={`https://www.imdb.com/name/${data?.imdb_id}/`} target="_blank">
        IMDB
      </a>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => history.goBack()}
        color="primary"
      >
        Go Back
      </Button>

      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {/* Loop through recommended movies */}

        {console.log(" Movies ", actorMovies)}

        {actorMovies && 
          <ActorMovieList
            actorMovies={actorMovies}
            numberOfSlice={12}
          />
        }
        {/* <Grid container >
          {actorMovies?.cast.map((movie, i) => (
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="" />
          ))}
        </Grid> */}
      </Box>
    </div>
  );
};

export default Actors;
