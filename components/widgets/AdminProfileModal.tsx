"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  TextField,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "@/utils/enum";
import { useRouter } from "next/navigation";

interface AdminProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminProfileModal({
  open,
  onClose,
}: AdminProfileModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleSave = () => {
    console.log("Saving password...");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      color: COLORS.TEXT_PRIMARY,
      backgroundColor: COLORS.WHITE,
      fontFamily: "var(--font-primary) !important",
      "& fieldset": { borderColor: COLORS.FOREGROUND },
      "&:hover fieldset": { borderColor: COLORS.ACCENT },
      "&.Mui-focused fieldset": { borderColor: COLORS.ACCENT },
    },
    "& .MuiInputLabel-root": {
      color: COLORS.TEXT_SECONDARY,
      fontFamily: "var(--font-primary) !important",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: COLORS.ACCENT },
    "& .MuiInputBase-input": {
      fontFamily: "var(--font-primary) !important",
      color: COLORS.TEXT_PRIMARY,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: COLORS.WHITE,
          color: COLORS.TEXT_PRIMARY,
          backgroundImage: "none",
          border: `1px solid ${COLORS.ACCENT}`,
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            fontFamily: "var(--font-primary) !important",
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          Admin Profile
        </Typography>
        <IconButton onClick={onClose} sx={{ color: COLORS.TEXT_PRIMARY }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: COLORS.FOREGROUND }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: COLORS.ACCENT,
              color: COLORS.WHITE,
              fontSize: 32,
              borderRadius: "10px",
            }}
          >
            A
          </Avatar>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontFamily: "var(--font-primary) !important",
              color: COLORS.TEXT_PRIMARY,
            }}
          >
            Admin
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "var(--font-primary) !important",
              color: COLORS.TEXT_SECONDARY,
              opacity: 0.8,
            }}
          >
            admin@shipgpt.com
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: COLORS.FOREGROUND }} />

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mt: 2,
            fontFamily: "var(--font-primary) !important",
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          Change Password
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={textFieldStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                    sx={{ color: COLORS.ACCENT }}
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={textFieldStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    sx={{ color: COLORS.ACCENT }}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={textFieldStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: COLORS.ACCENT }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          color="error"
          sx={{ borderRadius: "10px" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Box>
          <Button
            onClick={onClose}
            sx={{ color: COLORS.TEXT_SECONDARY, mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              !currentPassword ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword
            }
            sx={{
              bgcolor: COLORS.ACCENT,
              color: COLORS.WHITE,
              borderRadius: "10px",
              "&:hover": { bgcolor: "#0052E0" },
              "&:disabled": {
                bgcolor: COLORS.FOREGROUND,
                color: COLORS.TEXT_SECONDARY,
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
