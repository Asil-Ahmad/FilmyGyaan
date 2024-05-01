import React, { useEffect } from "react";

import { userSelector } from "../../features/auth";
import { useSelector } from "react-redux";

import { Typography, Button, Box } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import { useGetFavoriteQuery } from "../../services/TMDB";
import FavoriteMovieCard from "../FavoriteMovieCard/FavoriteMovieCard";

const Profile = () => {
  const { user } = useSelector(userSelector);
  // console.log("this is user data", user);

  const { data: favoriteMovies, refetch: refetch } = useGetFavoriteQuery({
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });
  useEffect(() => {
    refetch();
  }, []);
  // console.log(favoriteMovies);

  const logout = () => {
    localStorage.clear();

    window.location.href = "/";
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>
      {/* if not favoriteMovies */}
      {!favoriteMovies?.results?.length ? (
        <Typography variant="h5">Add Favorite Movie</Typography>
      ) : (
        <Box>
          <FavoriteMovieCard favoriteMovies={favoriteMovies} />
        </Box>
      )}
    </Box>
  );
};

export default Profile;
