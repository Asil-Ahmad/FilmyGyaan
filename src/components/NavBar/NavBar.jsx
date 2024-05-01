import React, { useState, useEffect } from "react";
//we using useState for sidebar mobileopen or close

import {
  AppBar,
  IconButton,
  Toolbar,
  Drawer,
  Button,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import {
  Menu,
  AccountCircle,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";

import { Link } from "react-router-dom";

import useStyles from "./styles";

import { useTheme } from "@mui/material/styles";
//we using above useTheme to make dark and ligh mode toggle
//then call it as hook

import { Search, Sidebar } from "..";

//Auth Process import
//for authencation in utils we also use useEffect
import { fetchToken, createSessionId, moviesApi } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
//we using this after we had put in store.js  import auth.js
import { setUser, userSelector } from "../../features/auth";

//For Dark theme and light
import { ColorModeContext } from "../../utils/ToggleColorMode";
import { useContext } from "react";

const NavBar = () => {
  const { isAuthenticated, user } = useSelector(userSelector);
  //We gonna use dispatch after store,js auth
  //console.log("This is User", user);
  const dispatch = useDispatch();

  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width:600px)");
  /* if something is larger then 600px it wont be mobile */

  const colorMode = useContext(ColorModeContext);
  //for light and dark theme

  const theme = useTheme();
  //using it as hook for toggle L&D mode

  //const isAuthenticated = false;
  //dummy auth for login

  const fakeImg =
    "https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec";

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~For SideBAR~~~~~~~~~~~~~~~~~~~~~
   */
  const [mobileOpen, setMobileOpen] = useState(false);

  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //We using this useEffect after creating sessionId in utils
  const token = localStorage.getItem("request_token");
  const sessionIdFromLocalStorage = localStorage.getItem("session_id");

  useEffect(() => {
    const logInUser = async () => {
      if (token) {
        if (sessionIdFromLocalStorage) {
          const { data: userData } = await moviesApi.get(
            `/account?session_id=${sessionIdFromLocalStorage}`
          );
          dispatch(setUser(userData));
          //console.log("This is Session", sessionIdFromLocalStorage);
        } else {
          const sessionId = await createSessionId();

          const { data: userData } = await moviesApi.get(
            `/account?session_id=${sessionId}`
          );
          window.location.href = "/"; //this will work when u login u go to popular pages
          dispatch(setUser(userData));
        }
      }
    };
    logInUser();
  }, [token]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          {isMobile && (
            // ~~~~~~~~~~~~For Hamburger Menu For Mobile Devices~~~~~~~~~~~~~~
            <IconButton
              color="inherit"
              edge="start"
              style={{ outline: "none" }} //,color:'white'
              onClick={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              //onClick={() => setMobileOpen(!mobileOpen)}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
          )}
          {/* ~~~~~~~~~~~~For Dark and Light theme button~~~~~~~~~~~~~~~~~~~~~ */}
          <IconButton
            color="inherit"
            sx={{ ml: 2 }}
            onClick={colorMode.toggleColorMode}
          >
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* if not mobile show search component */}
          {!isMobile && <Search />}

          {/* We gonna add Authentication below in the div so we make dummy auth */}
          <div>
            {!isAuthenticated ? (
              <Button color="inherit" onClick={fetchToken}>
                Login &nbsp; <AccountCircle />
              </Button>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to={`/profile/${user.id}`}
                onClick={() => {}}
                className={classes.linkButton}
              >
                {!isMobile && <>My Movies &nbsp; </>}
                <Avatar
                  style={{ width: 30, height: 30 }}
                  alt="profile"
                  src={'https://www.themoviedb.org/t/p/w64_and_h64_face${user?.avatar?.tmdb?.avatar_path}'}
                />
              </Button>
            )}
           {/* here u can use  {console.log(user.id)} */}
          </div>
          {isMobile && <Search />}
        </Toolbar>
      </AppBar>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~SIDE BAR~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <div>
        <nav className={classes.drawer}>
          {isMobile ? (
            <Drawer
              variant="temporary"
              anchor="left" //open from left side
              open={mobileOpen} //its a useState function its false initial state
              onClose={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              // onClose={() => setMobileOpen(!mobileOpen)}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}
              //className={classes.drawerBackground}
              //onClick={handleDrawerToggle}
            >
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          ) : (
            <Drawer
              open //this means always open
              variant="permanent" //always stay on the screen
              classes={{ paper: classes.drawerPaper }}
            >
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          )}
        </nav>
      </div>
    </>
  );
};

export default NavBar;
