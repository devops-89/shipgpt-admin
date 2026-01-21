"use client";
import { useState, useRef, useEffect } from "react";
import { authControllers } from "@/api/auth";
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Backdrop,
    Stack,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { scienceGothic } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useFormik } from "formik";
import { loginValidationSchema, resetPasswordValidationSchema } from "@/utils/validationSchema";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { forgotPassword, resetPassword } from "@/redux/slices/userSlice";

type AuthView = "login" | "forgot" | "reset";

export default function LoginPage() {
    const [currentView, setCurrentView] = useState<AuthView>("login");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info" as "success" | "info" | "warning" | "error",
    });

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: loginValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await authControllers.login(values);
                const token = response.data?.data?.access_token;

                if (token) {
                    localStorage.setItem("accessToken", token);
                    const user = response.data?.data?.user || response.data?.data;
                    const role = user?.role || user?.user_role || (user?.isAdmin ? 'ADMIN' : '') || (user?.isSuperAdmin ? 'SUPER_ADMIN' : '');
                    if (role) localStorage.setItem("userRole", role);
                    if (user?.email) localStorage.setItem("userEmail", user.email);

                    setSnackbar({ open: true, message: "Login Successfully!", severity: "success" });
                    setTimeout(() => router.push("/admin-management"), 1500);
                } else {
                    setSnackbar({ open: true, message: "Token missing. Contact support.", severity: "error" });
                    setLoading(false);
                }
            } catch (error) {
                setSnackbar({ open: true, message: "Login failed. Check credentials.", severity: "error" });
                setLoading(false);
            }
        },
    });

    const resetFormik = useFormik({
        initialValues: { otp: "", newPassword: "" },
        validationSchema: resetPasswordValidationSchema,
        onSubmit: async (values) => {
            setForgotLoading(true);
            try {
                const res = await dispatch(resetPassword({
                    email: forgotEmail,
                    otp: values.otp,
                    newPassword: values.newPassword
                }));

                if (resetPassword.fulfilled.match(res)) {
                    setSnackbar({ open: true, message: "Password reset successfully!", severity: "success" });
                    setTimeout(() => setCurrentView("login"), 1500);
                    resetFormik.resetForm();
                } else {
                    setSnackbar({ open: true, message: res.payload as string || "Failed to reset password", severity: "error" });
                }
            } catch (err) {
                setSnackbar({ open: true, message: "An unexpected error occurred", severity: "error" });
            } finally {
                setForgotLoading(false);
            }
        },
    });

    const handleSendOtp = async () => {
        if (!forgotEmail) {
            setSnackbar({ open: true, message: "Please enter your email", severity: "error" });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(forgotEmail)) {
            setSnackbar({ open: true, message: "Please enter a valid email address", severity: "error" });
            return;
        }
        setForgotLoading(true);
        try {
            const res = await dispatch(forgotPassword({ email: forgotEmail }));
            if (forgotPassword.fulfilled.match(res)) {
                setSnackbar({ open: true, message: "OTP sent to your email!", severity: "success" });
                setCurrentView("reset");
            } else {
                setSnackbar({ open: true, message: res.payload as string || "Failed to send OTP", severity: "error" });
            }
        } catch (err) {
            setSnackbar({ open: true, message: "An unexpected error occurred", severity: "error" });
        } finally {
            setForgotLoading(false);
        }
    };

    const commonTextFieldSx = {
        "& .MuiOutlinedInput-root": {
            color: COLORS.WHITE,
            fontFamily: `${scienceGothic.style.fontFamily} !important`,
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
            "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
            "&.Mui-focused fieldset": { borderColor: COLORS.WHITE },
        },
        "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: `${scienceGothic.style.fontFamily} !important`,
            "&.Mui-focused": { color: COLORS.WHITE },
        },
        "& input": {
            fontFamily: `${scienceGothic.style.fontFamily} !important`,
            backgroundColor: "transparent !important",
            transition: "background-color 5000s ease-in-out 0s !important",
            "&:-webkit-autofill": {
                WebkitTextFillColor: `${COLORS.WHITE} !important`,
                WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
            },
        },
        "& .MuiFormHelperText-root": {
            fontFamily: `${scienceGothic.style.fontFamily} !important`,
        }
    };

    const fontStyle = {
        fontFamily: `${scienceGothic.style.fontFamily} !important`,
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/login-bg.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                overflow: "hidden",
            }}
        >
            <Card
                sx={{
                    width: { xs: "90%", sm: 450 }, // Slightly wider to match reference
                    minHeight: 450, // To maintain the substantial look of the card in the photo
                    backdropFilter: "blur(12px)",
                    background: "rgba(255, 255, 255, 0.15)",
                    color: COLORS.WHITE,
                    borderRadius: 4,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <CardContent sx={{ p: 5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h4" sx={{
                            ...fontStyle,
                            fontWeight: 600,
                            mb: 1.5,
                            textTransform: 'none',
                            letterSpacing: '0.5px',
                            fontSize: '1.7rem'
                        }}>
                            {currentView === "login" ? "Ship GPT" : currentView === "forgot" ? "Forgot Password?" : "Reset Password"}
                        </Typography>
                        <Typography variant="body1" sx={{
                            ...fontStyle,
                            color: "rgba(255,255,255,0.7)",
                            lineHeight: 1.6,
                            maxWidth: '300px',
                            margin: '0 auto',
                            fontSize: '1rem'
                        }}>
                            {currentView === "login"
                                ? "Welcome back, please login"
                                : currentView === "forgot"
                                    ? "Enter your email address to reset your password."
                                    : "Enter the OTP and your new password below."}
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1, pt: currentView === "forgot" ? 3 : 0 }}>
                        {currentView === "login" && (
                            <form onSubmit={formik.handleSubmit}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        id="email"
                                        InputLabelProps={{ shrink: true }}
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.errors.email}
                                        sx={commonTextFieldSx}
                                    />
                                    <Box>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            id="password"
                                            InputLabelProps={{ shrink: true }}
                                            type={showPassword ? "text" : "password"}
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            error={formik.touched.password && Boolean(formik.errors.password)}
                                            helperText={formik.errors.password}
                                            sx={commonTextFieldSx}
                                        />
                                        <Box textAlign="right" mt={1}>
                                            <Typography
                                                variant="body2"
                                                onClick={() => {
                                                    setForgotEmail(formik.values.email);
                                                    setCurrentView("forgot");
                                                }}
                                                sx={{
                                                    ...fontStyle,
                                                    cursor: "pointer",
                                                    color: COLORS.WHITE,
                                                    opacity: 0.7,
                                                    fontSize: '0.9rem',
                                                    "&:hover": { opacity: 1, textDecoration: 'underline' }
                                                }}
                                            >
                                                Forgot password?
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            py: 1.8, borderRadius: 3, background: COLORS.WHITE, color: COLORS.BLACK, fontWeight: 600,
                                            ...fontStyle,
                                            textTransform: 'uppercase',
                                            "&:hover": { background: "rgba(255, 255, 255, 0.9)" },
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} sx={{ color: COLORS.BLACK }} /> : "Login"}
                                    </Button>
                                </Stack>
                            </form>
                        )}

                        {currentView === "forgot" && (
                            <Stack spacing={4}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    disabled={forgotLoading}
                                    InputLabelProps={{ shrink: true }}
                                    sx={commonTextFieldSx}
                                />
                                <Button
                                    fullWidth
                                    size="large"
                                    onClick={handleSendOtp}
                                    disabled={forgotLoading}
                                    sx={{
                                        py: 1.8, mt: 2, borderRadius: 3, background: COLORS.WHITE, color: COLORS.BLACK, fontWeight: 600,
                                        ...fontStyle,
                                        textTransform: 'none',
                                        "&:hover": { background: "rgba(255, 255, 255, 0.9)" },
                                    }}
                                >
                                    {forgotLoading ? <CircularProgress size={24} sx={{ color: COLORS.BLACK }} /> : "Send Reset Link"}
                                </Button>
                                <Box textAlign="center" mt={2}>
                                    <Typography
                                        variant="body1"
                                        onClick={() => setCurrentView("login")}
                                        sx={{
                                            ...fontStyle,
                                            cursor: "pointer",
                                            color: "rgba(255,255,255,0.7)",
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            "&:hover": { color: COLORS.WHITE, textDecoration: 'underline' }
                                        }}
                                    >
                                        Return to Login
                                    </Typography>
                                </Box>
                            </Stack>
                        )}

                        {currentView === "reset" && (
                            <form onSubmit={resetFormik.handleSubmit}>
                                <Stack spacing={3}>
                                    <Stack direction="row" spacing={2} justifyContent="center">
                                        {[0, 1, 2, 3].map((index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    width: 70,
                                                    height: 70,
                                                    background: "rgba(255, 255, 255, 0.1)",
                                                    borderRadius: 2,
                                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    maxLength={1}
                                                    value={resetFormik.values.otp[index] || ""}
                                                    onKeyDown={(e: any) => {
                                                        if (e.key === "Backspace" && !resetFormik.values.otp[index] && index > 0) {
                                                            const prev = e.target.parentElement?.previousElementSibling?.querySelector("input");
                                                            prev?.focus();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, "");
                                                        if (!val && e.target.value.length > 0) return;

                                                        const otpArr = resetFormik.values.otp.split("");
                                                        otpArr[index] = val;
                                                        const finalOtp = otpArr.join("");
                                                        if (finalOtp.length <= 4) {
                                                            resetFormik.setFieldValue("otp", finalOtp);
                                                            if (val && index < 3) {
                                                                const next = e.target.parentElement?.nextElementSibling?.querySelector("input");
                                                                next?.focus();
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        background: "transparent",
                                                        border: "none",
                                                        outline: "none",
                                                        textAlign: "center",
                                                        fontSize: "1.8rem",
                                                        fontWeight: 700,
                                                        color: COLORS.WHITE,
                                                        fontFamily: scienceGothic.style.fontFamily
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                    {resetFormik.touched.otp && resetFormik.errors.otp && (
                                        <Typography color="error" variant="caption" sx={{ textAlign: 'center', mt: -1, ...fontStyle }}>
                                            {resetFormik.errors.otp}
                                        </Typography>
                                    )}

                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={resetFormik.values.newPassword}
                                        onChange={resetFormik.handleChange}
                                        error={resetFormik.touched.newPassword && Boolean(resetFormik.errors.newPassword)}
                                        helperText={resetFormik.touched.newPassword && resetFormik.errors.newPassword}
                                        disabled={forgotLoading}
                                        InputLabelProps={{ shrink: true }}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={commonTextFieldSx}
                                    />
                                    <Box>
                                        <Button
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            disabled={forgotLoading}
                                            sx={{
                                                py: 1.8, mt: 1, borderRadius: 3, background: COLORS.WHITE, color: COLORS.BLACK, fontWeight: 600,
                                                ...fontStyle,
                                                textTransform: 'none',
                                                "&:hover": { background: "rgba(255, 255, 255, 0.9)" },
                                            }}
                                        >
                                            {forgotLoading ? <CircularProgress size={24} sx={{ color: COLORS.BLACK }} /> : "Reset Password"}
                                        </Button>

                                        <Box textAlign="center" mt={3}>
                                            <Typography variant="body2" sx={{ ...fontStyle, color: "rgba(255,255,255,0.6)", mb: 2 }}>
                                                Didn't receive the code? <span style={{ color: COLORS.WHITE, cursor: 'pointer', fontWeight: 600 }}>Resend in 38s</span>
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                onClick={() => {
                                                    setCurrentView("forgot");
                                                    resetFormik.resetForm();
                                                }}
                                                sx={{
                                                    ...fontStyle,
                                                    cursor: "pointer",
                                                    color: "rgba(255,255,255,0.7)",
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    "&:hover": { color: COLORS.WHITE, textDecoration: 'underline' }
                                                }}
                                            >
                                                Back to Verification
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </form>
                        )}
                    </Box>
                </CardContent>
            </Card>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%", ...fontStyle, fontWeight: 500 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
