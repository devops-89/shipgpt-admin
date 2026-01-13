// import { Box, Typography, Avatar, IconButton } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import React from 'react';
// import AdminProfileModal from './AdminProfileModal';

// interface NavbarProps {
//     onMenuClick?: () => void;
// }

// export default function Navbar({ onMenuClick }: NavbarProps) {
//     const [openProfile, setOpenProfile] = React.useState(false);

//     return (
//         <Box
//             sx={{
//                 height: 64,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 px: 3,
//                 borderBottom: "1px solid var(--border)",
//                 bgcolor: "var(--background)",
//                 color: "var(--foreground)",
//             }}
//         >
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 {onMenuClick && (
//                     <IconButton
//                         color="inherit"
//                         aria-label="open drawer"
//                         edge="start"
//                         onClick={onMenuClick}
//                         sx={{ display: { md: 'none' } }}
//                     >
//                         <MenuIcon />
//                     </IconButton>
//                 )}
//                 <Typography fontWeight={600}>ShipGPT</Typography>
//             </Box>

//             <Box
//                 display="flex"
//                 alignItems="center"
//                 gap={1}
//                 onClick={() => setOpenProfile(true)}
//                 sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
//             >
//                 <Typography variant="body2">ADMIN</Typography>
//                 <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
//             </Box>

//             {openProfile && (
//                 <AdminProfileModal
//                     open={openProfile}
//                     onClose={() => setOpenProfile(false)}
//                 />
//             )}
//         </Box>
//     );
// }
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import AdminProfileModal from "./AdminProfileModal";
import { COLORS } from "@/utils/enum";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [openProfile, setOpenProfile] = React.useState(false);

  return (
    <Box
      sx={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        borderBottom: `1px solid ${COLORS.FOREGROUND}`,
        bgcolor: COLORS.WHITE,
        color: COLORS.TEXT_PRIMARY,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {onMenuClick && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: "none" }, color: COLORS.TEXT_PRIMARY }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography fontWeight={600} sx={{ color: COLORS.TEXT_PRIMARY }}>
          ShipGPT
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        onClick={() => setOpenProfile(true)}
        sx={{
          cursor: "pointer",
          color: COLORS.TEXT_PRIMARY,
          "&:hover": { opacity: 0.8 },
        }}
      >
        <Typography variant="body2">ADMIN</Typography>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: COLORS.ACCENT,
            color: COLORS.WHITE,
            borderRadius: "10px",
          }}
        >
          A
        </Avatar>
      </Box>

      {openProfile && (
        <AdminProfileModal
          open={openProfile}
          onClose={() => setOpenProfile(false)}
        />
      )}
    </Box>
  );
}