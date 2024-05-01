import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  imageLink: {
    display: "flex",
    justifyContent: "center",
    padding: "10% 0",

  },
  image: {
    width: "90%",
  },
  links: {
    color: theme.palette.text.primary,
    
    textDecoration: "none", //this removes the underline under text
  },
  genreImages: {
    filter: theme.palette.mode === "dark" && "invert(1)",
    
    // filter: theme.palette.mode === "dark" ? "dark" : "invert(1)",
    //if we on dark mode it will invert the images so its more visible in dark mode
  },

  label: {
    
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
}));
