import { Box } from "@mui/material";
import Sidebar from "@/components/widgets/Sidebar";
import Navbar from "@/components/widgets/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar – 20% */}
      <Box sx={{ width: "20%", height: "100%", overflowY: "auto", borderRight: "1px solid var(--border)" }}>
        <Sidebar />
      </Box>

      {/* Main – 80% */}
      <Box sx={{ width: "80%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</Box>
      </Box>
    </Box>
  );
}
