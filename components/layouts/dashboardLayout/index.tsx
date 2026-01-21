import { useState } from "react";
import { Box, useTheme, useMediaQuery, Drawer } from "@mui/material";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";
import { COLORS } from "@/utils/enum";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: COLORS.FOREGROUND }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: "260px",
            height: "100%",
            overflowY: "auto",
            borderRight: `1px solid ${COLORS.FOREGROUND}`,
            bgcolor: COLORS.WHITE,
          }}
        >
          <Sidebar />
        </Box>
      )}

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 260,
            bgcolor: COLORS.WHITE,
          },
        }}
      >
        <Sidebar />
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : "calc(100% - 260px)",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Navbar onMenuClick={handleDrawerToggle} />
        <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
