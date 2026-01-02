
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

export default function AdminProfileModal({ open, onClose }: AdminProfileModalProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();

    const handleSave = () => {
        // Logic to save password
        console.log("Saving password...");
        // Reset fields and close
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
        '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            color: COLORS.WHITE,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            fontFamily: 'var(--font-primary) !important',
            '& fieldset': { borderColor: COLORS.WHITE },
            '&:hover fieldset': { borderColor: COLORS.WHITE },
            '&.Mui-focused fieldset': { borderColor: COLORS.WHITE },
        },
        '& .MuiInputLabel-root': { color: COLORS.WHITE, fontFamily: 'var(--font-primary) !important' },
        '& .MuiInputLabel-root.Mui-focused': { color: COLORS.WHITE },
        '& .MuiInputBase-input': { fontFamily: 'var(--font-primary) !important', color: COLORS.WHITE },
        '& .MuiFormHelperText-root': { fontFamily: 'var(--font-primary) !important' }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: "var(--card-bg)",
                    color: "var(--foreground)",
                    backgroundImage: "none",
                    border: '1px solid var(--border)',
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'var(--font-primary) !important' }}>Admin Profile</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: COLORS.WHITE,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: "var(--border)" }}>
                {/* Profile Info */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: "primary.main", fontSize: 32 }}>A</Avatar>
                    <Typography variant="h5" gutterBottom sx={{ fontFamily: 'var(--font-primary) !important' }}>Admin</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'var(--font-primary) !important' }}>admin@shipgpt.com</Typography>
                </Box>

                <Divider sx={{ my: 2, borderColor: "var(--border)" }} />

                {/* Change Password */}
                <Typography variant="h6" gutterBottom sx={{ mt: 2, fontFamily: 'var(--font-primary) !important' }}>
                    Change Password
                </Typography>

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Current Password"
                        type={showCurrentPassword ? "text" : "password"}
                        fullWidth
                        variant="outlined"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        sx={textFieldStyle}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        edge="end"
                                        sx={{ color: COLORS.WHITE }}
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
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={textFieldStyle}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                        sx={{ color: COLORS.WHITE }}
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
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={textFieldStyle}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        sx={{ color: COLORS.WHITE }}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button
                    onClick={handleLogout}
                    variant="outlined"
                    color="error"
                    sx={{ borderRadius: 0 }}
                >
                    Logout
                </Button>
                <Box>
                    <Button onClick={onClose} sx={{ color: "var(--text-secondary)", mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained"
                        disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    >
                        Save Changes
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
