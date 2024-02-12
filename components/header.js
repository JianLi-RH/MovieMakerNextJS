import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function Header({ children }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      {children}
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <DashboardIcon
          sx={{ color: "#444", mr: 2, transform: "translateY(-2px)" }}
        />
        <Typography variant="h6" noWrap component="div" color="black">
          MovieMaker - 最便捷的沙雕视频制作工具
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
