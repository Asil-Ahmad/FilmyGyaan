import { makeStyles } from "@mui/styles";

const drawerWidth = 240;
//this is added just for sidebar in sidebar section

export default makeStyles((theme) => ({
  toolbar: {
    height: "80px",
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "240px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      flexWrap: "wrap",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  linkButton: {
    "&:hover": {
      color: "red !important",
      textDecoration: "none",
      cursor: "pointer",
    },
  },

  // For SIDEBAR

  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  drawerPaper: {
    width: drawerWidth,
  },
}));
