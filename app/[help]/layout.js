import Box from "@mui/material/Box";

import GlobalConifg from "@/lib/app.config.js";
const DRAWER_WIDTH = GlobalConifg.DRAWER_WIDTH;

export default function Layout({ children }) {
  return (
    <Box
      component="div"
      sx={{
        flexGrow: 1,
        bgcolor: "background.default",
        ml: `${DRAWER_WIDTH}px`,
        mt: ["48px", "56px", "64px"],
        p: 3,
      }}
    >
      <article>{children} </article>
    </Box>
  );
}
