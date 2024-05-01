import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/styles";
import useStyles from "./style";
// _____________________________________________________
import { useGetGenresQuery } from "../../services/TMDB";
import { genreIcons } from "../../assets/genres";
//______________________________________________________
import { useDispatch, useSelector } from "react-redux";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import { logoblue, logored } from "../../assets/images";
//______________________________________________________

const categories = [
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Upcoming", value: "upcoming" },
];

const redLogo = logoblue;

const blueLogo = logored;

const Sidebar = ({ setMobileOpen }) => {
  //_______________________Hooks____________________
  const theme = useTheme();
  const classes = useStyles();

  const { data, isFetching } = useGetGenresQuery();
  //console.log(data);

  //__________________Dispatch And Selector________________________________________
  const dispatch = useDispatch();
  //dispatch mean to send or transfer specific data from our component to our redux
  //we doing this when we click categories we send it to redux now how acutally retrieve data
  const { genreIdOrCategoryName } = useSelector(
    (state) => state.currentGenreOrCategory
  );
  //console.log(genreIdOrCategoryName);
  //_________________________________________________________________________________
  useEffect(() => {
    setMobileOpen(false);
  }, [genreIdOrCategoryName]);
  return (
    <>
      <Link to="/" className={classes.imageLink}>
        <img
          className={classes.image}
          src={theme.palette.mode === "light" ? redLogo : blueLogo}
          alt="Logo"
        />
      </Link>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~Divider Adds Line Below~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <Divider />
      <List>
        <ListSubheader>Categories</ListSubheader>
        {categories.map(({ label, value }) => (
          <Link key={value} className={classes.links} to="/">
            {/* NOW WE GONNA USE DISPATCH ONCLICK BELOW TO SEND 
            BUT WHAT ACTION WE NEED TO DISPATCH???
            WELL ITS selectGenreOrCategory(value) */}
            <ListItem
              onClick={() => dispatch(selectGenreOrCategory(value))}
              className={classes.label}
            >
              <ListItemIcon>
                <img
                  src={genreIcons[label.toLowerCase()]} //THIS THING IS CONFUSING DO CHECK IT LATER
                  className={classes.genreImages}
                  height={30}
                />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
      </List>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~Next Dividerthe copy paste above~~~~~~~~~~~~~~~~~ */}
      <Divider />
      <List>
        <ListSubheader>Genres</ListSubheader>
        {isFetching ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress size="4rem" />
          </Box>
        ) : (
          data.genres.map(({ name, id }) => (
            <Link key={id} className={classes.links} to="/">
              <ListItem
                onClick={() => dispatch(selectGenreOrCategory(id))}
                className={classes.label}
              >
                <ListItemIcon>
                  <img
                    src={genreIcons[name.toLowerCase()]}
                    className={classes.genreImages}
                    height={30}
                  />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            </Link>
          ))
        )}
      </List>
    </>
  );
};

export default Sidebar;
