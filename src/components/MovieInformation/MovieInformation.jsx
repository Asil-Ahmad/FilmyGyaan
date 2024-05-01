import React, { useEffect, useState } from "react";

import {
  Modal,
  Typography,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  Button,
  Rating,
} from "@mui/material";
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
  Movie,
} from "@mui/icons-material";

import { Link, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";

import axios from "axios";

import {
  useGetFavoriteQuery,
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetWatchlistQuery,
} from "../../services/TMDB";

import useStyles from "./styles";
import { genreIcons } from "../../assets/genres";
import MovieList from "../MovieList/MovieList";

import { userSelector } from "../../features/auth";
//for user

const MovieInformation = () => {
  const { user } = useSelector(userSelector); //this will let access to the user

  const { id } = useParams(); //getting id from the url
  //console.log(id);
  const classes = useStyles(); //css

  const [open, setOpen] = useState(false); //for button for All Cast /showless

  const [openVideo, setOpenVideo] = useState(false);
  //```````````````````````````````````````````````````````````````````
  const dispatch = useDispatch();

  const { data, isFetching, error } = useGetMovieQuery(id);
  //console.log("Movie Data", data);

  const { data: favoriteMovies } = useGetFavoriteQuery({
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });

  const { data: watchlistMovies } = useGetWatchlistQuery({
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });

  const { data: recommendations, isFetching: isRecommendationFetching } =
    useGetRecommendationsQuery({ movie_id: id }); //here we getting recommendation of movies
  //console.log("Recommend", recommendations);

  //~~~~~~~~~~~~~~~~~~~~~~For Axios Request for api calls for fav and watchlist movies ~~~~~~~~~~~~~~~~~~~~~~~~~~
  //why we calling api call inside the  function not redux becoz we dont want to do it at global level
  //we need it inside a function.plus you cant/allowed-to use useAddMovieToFavorQuery inside the function also

  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  //we using useEffect to check if movie is alredy fav or not plus refresh wont chnage the value of like
  useEffect(() => {
    setIsMovieFavorited(
      !!favoriteMovies?.results?.find((movie) => movie?.id === data?.id)
    );
  }, [favoriteMovies, data]);
  // console.log("List of Fav Movies", favoriteMovies?.results);

  const addToFavorites = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem("session_id")}`,
      {
        media_type: "movie",
        media_id: id,
        favorite: !isMovieFavorited,
      }
    );
    setIsMovieFavorited((prev) => !prev);
  };

  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  useEffect(() => {
    setIsMovieWatchlisted(
      !!watchlistMovies?.results?.find((movie) => movie?.id === data?.id)
    );
  }, [watchlistMovies, data]);
  // console.log(
  //   "List of WatchList Movies",
  //   watchlistMovies?.results[0]?.original_title
  // );

  const addToWatchlist = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem("session_id")}`,
      {
        media_type: "movie",
        media_id: id,
        watchlist: !isMovieWatchlisted,
      }
    );
    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }
  if (error) {
    <Box display="flex" justifyContent="center">
      <Link to="/">Something has gone wrong - Reload the page</Link>
    </Box>;
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data.release_date.split("-")[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={data.vote_average / 2} precision={0.5} />
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginLeft: "10px" }}
            >
              {data?.vote_average.toFixed(1)} / 10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime} min | Language :{data?.spoken_languages[0].name}
            {/*   {data?.runtime} min /{" "}
            {data?.spoken_languages.length > 0
              ? data?.spoken_languages[0].name
              : " "} */}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data.genres.map((genre, i) => (
            <Link
              key={genre.name}
              className={classes.links}
              to="/"
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                className={classes.genreImage}
                height={30}
              />
              <Typography
                className={classes.under}
                color="textPrimary"
                variant="subtitle1"
              >
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>

        <Typography variant="h5" gutterBottom style={{ marginTop: "10px" }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: "2rem" }}>
          {data?.overview}
        </Typography>

        <Typography variant="h5" gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {/* data && mean if data exist then move to data.credits? */}
          {data &&
            data.credits?.cast
              ?.map(
                (character, i) =>
                  character.profile_path && (
                    <Grid
                      key={i}
                      item
                      xs={4}
                      md={2}
                      component={Link}
                      to={`/actors/${character.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${character?.profile_path}`}
                        alt={character.name}
                        className={classes.castImage}
                      />
                      <Typography color="textPrimary">
                        {character?.name}
                      </Typography>
                      <Typography color="textSecondary">
                        {character?.character.split("/")[0]}
                      </Typography>
                    </Grid>
                  )
              )
              .slice(0, open ? undefined : 6)}
        </Grid>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~BUTTON~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <Button variant="outlined" onClick={() => setOpen(!open)}>
          {open ? "Show Less" : "All Cast"}
        </Button>
        <Grid item container style={{ marginTop: "2rem" }}>
          <div className={classes.buttonContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonContainer}>
              <ButtonGroup size="small" variant="outlined">
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={data?.homepage}
                  endIcon={<Language />}
                >
                  Website
                </Button>

                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.imdb.com/title/${data?.imdb_id}/`}
                  endIcon={<MovieIcon />}
                >
                  IMDB
                </Button>

                <Button
                  onClick={() => setOpenVideo(true)}
                  href="#"
                  endIcon={<Theaters />}
                >
                  Trailers
                </Button>
              </ButtonGroup>
            </Grid>

            <Grid item xs={12} sm={6} className={classes.buttonContainer}>
              <ButtonGroup size="small" variant="outlined">
                <Button
                  onClick={addToFavorites}
                  endIcon={
                    isMovieFavorited ? <Favorite /> : <FavoriteBorderOutlined />
                  }
                >
                  {isMovieFavorited ? "Like" : "Like"}
                </Button>

                <Button
                  onClick={addToWatchlist}
                  endIcon={isMovieWatchlisted ? <PlusOne /> : <Remove />}
                >
                  Watchlist
                </Button>
                <Button
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: "primary.main" }}
                >
                  <Typography
                    component={Link}
                    style={{ textDecoration: "none" }}
                    to="/"
                    color="inherit"
                    variant="subtitle"
                  >
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {/* Loop through recommended movies */}

        {recommendations ? (
          <MovieList movies={recommendations} numberOfSlice={6} />
        ) : (
          <Box>Sorry</Box>
        )}
      </Box>
      {/* {console.log("Videos", data.videos.results)} */}

      {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ For Trailer We using this below~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <Modal
        closeAfterTransistion
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        className={classes.modal}
      >
        <iframe
          src={`https://www.youtube.com/embed/${data?.videos?.results[0]?.key}`}
          frameborder="0"
          className={classes.video}
          title="Trailers"
          allow="autoplay"
        />
      </Modal>
    </Grid>
  );
};

export default MovieInformation;

/* 
 <div>
      <h1>
        {data.title} ({data.release_date.split('-')[0]})
      </h1>
      <img src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`} alt=' />
      <h4>{data.tagline}</h4>
      <Rating readOnly value={data.vote_average / 2} precision={0.5} />
      <h6>{(data.vote_average / 2).toFixed(1)}</h6>
      {data.genres.map((genre, id) => (
        <Link key={id} to='/'>
          {genre.name}
        </Link>
      ))}
      <a href={data.homepage}>Link</a>
       //https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png
    </div>
     */
