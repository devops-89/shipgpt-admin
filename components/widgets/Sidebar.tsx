// "use client";

// import {
//     Box,
//     List,
//     ListItemButton,
//     ListItemIcon,
//     ListItemText,
// } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import GroupIcon from "@mui/icons-material/Group";
// import SettingsIcon from "@mui/icons-material/Settings";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
// import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function Sidebar() {
//     const pathname = usePathname();

//     return (
//         <Box sx={{
//             height: "100vh",
//             borderRight: "1px solid var(--border)",
//             bgcolor: "var(--background)",
//             color: "var(--foreground)",
//             '& .MuiListItemButton-root': {
//                 color: 'var(--foreground)',
//             },
//             '& .MuiListItemIcon-root': {
//                 color: 'var(--foreground)',
//             },
//             '& .Mui-selected': {
//                 bgcolor: 'var(--surface-dark) !important',
//                 color: '#fff !important',
//                 '& .MuiListItemIcon-root': {
//                     color: '#fff !important',
//                 },
//                 '&:hover': {
//                     bgcolor: 'var(--black) !important',
//                 }
//             },
//             '& .MuiListItemButton-root:hover': {
//                 bgcolor: 'rgba(255,255,255,0.05)',
//             },
//             '& a': {
//                 textDecoration: 'none',
//                 color: 'inherit'
//             }
//         }}>
//             {/* Logo */}
//             <Box sx={{ p: 2, fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.05em' }}>SHIPGPT</Box>

//             <List>


//                 <Link href="/admin-management">
//                     <ListItemButton selected={pathname === "/admin-management"}>
//                         <ListItemIcon>
//                             <SettingsIcon />
//                         </ListItemIcon>
//                         <ListItemText primary="Admin Management" />
//                     </ListItemButton>
//                 </Link>

//                 <Link href="/users-management">
//                     <ListItemButton selected={pathname === "/users-management"}>
//                         <ListItemIcon>
//                             <AdminPanelSettingsIcon />
//                         </ListItemIcon>
//                         <ListItemText primary="Users Management" />
//                     </ListItemButton>
//                 </Link>


//                 <Link href="/ship-management">
//                     <ListItemButton selected={pathname === "/ship-management"}>
//                         <ListItemIcon>
//                             <DirectionsBoatIcon />
//                         </ListItemIcon>
//                         <ListItemText primary="Ship Management" />
//                     </ListItemButton>
//                 </Link>

//                 <Link href="/crew-management">
//                     <ListItemButton selected={pathname === "/crew-management"}>
//                         <ListItemIcon>
//                             <GroupIcon />
//                         </ListItemIcon>
//                         <ListItemText primary="Crew Management" />
//                     </ListItemButton>
//                 </Link>

//                 <Link href="/superintendent-management">
//                     <ListItemButton selected={pathname === "/superintendent-management"}>
//                         <ListItemIcon>
//                             <SupervisorAccountIcon />
//                         </ListItemIcon>
//                         <ListItemText primary="Superintendent" />
//                     </ListItemButton>
//                 </Link>
//             </List>
//         </Box>
//     );
// }

"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS } from "@/utils/enum";
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        height: "100vh",
        borderRight: `1px solid ${COLORS.FOREGROUND}`,
        bgcolor: COLORS.WHITE,
        color: COLORS.TEXT_PRIMARY,

        "& .MuiListItemButton-root": {
          color: COLORS.TEXT_PRIMARY,
        },
        "& .MuiListItemIcon-root": {
          color: COLORS.TEXT_PRIMARY,
        },

        "& .Mui-selected": {
          bgcolor: COLORS.ACCENT + " !important",
          color: COLORS.WHITE + " !important",
          "& .MuiListItemIcon-root": {
            color: COLORS.WHITE + " !important",
          },
          "&:hover": {
            bgcolor: "#0052E0 !important",
          },
        },

        "& .MuiListItemButton-root:hover": {
          bgcolor: COLORS.FOREGROUND,
        },

        "& a": {
          textDecoration: "none",
          color: "inherit",
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          fontWeight: 700,
          fontSize: "1.2rem",
          letterSpacing: "0.05em",
          color: COLORS.TEXT_PRIMARY,
        }}
      >
        SHIPGPT
      </Box>

      <List>
        <Link href="/admin-management">
          <ListItemButton selected={pathname === "/admin-management"}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Admin Management" />
          </ListItemButton>
        </Link>

        <Link href="/users-management">
          <ListItemButton selected={pathname === "/users-management"}>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Users Management" />
          </ListItemButton>
        </Link>

        <Link href="/ship-management">
          <ListItemButton selected={pathname === "/ship-management"}>
            <ListItemIcon>
              <DirectionsBoatIcon />
            </ListItemIcon>
            <ListItemText primary="Ship Management" />
          </ListItemButton>
        </Link>

        <Link href="/crew-management">
          <ListItemButton selected={pathname === "/crew-management"}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Crew Management" />
          </ListItemButton>
        </Link>

        <Link href="/superintendent-management">
          <ListItemButton selected={pathname === "/superintendent-management"}>
            <ListItemIcon>
              <SupervisorAccountIcon />
            </ListItemIcon>
            <ListItemText primary="Superintendent" />
          </ListItemButton>
        </Link>
      </List>
    </Box>
  );
}