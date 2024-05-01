import React, { useState, useMemo, createContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ColorModeContext = createContext();
//createContext is a react utility funtion

const ToggleColorMode = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
   
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
  //useMemo is like useEffect also with dependecy array but it onnly changes
  //when the 'mode' changes
  //but we removing {} and adding createTheme and inside we calling function

  return (
    <>
      <ColorModeContext.Provider value={{ mode, setMode, toggleColorMode }}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ColorModeContext.Provider>
      ;
    </>
  );
};

export default ToggleColorMode;
