"use client";
import { useState } from "react";
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
  Modal,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { scienceGothic } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useFormik } from "formik";
import { loginValidationSchema } from "@/utils/validationSchema";
import { useRouter } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { forgotPassword } from "@/redux/slices/userSlice";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openForgotModal, setOpenForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "info" | "warning" | "error",
  });

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await authControllers.login(values);
        console.log("LOGIN RESPONSE FULL:", response);
        console.log("LOGIN RESPONSE data:", response.data);
        const token = response.data?.data?.access_token;

        if (token) {
          console.log("Saving Access Token:", token);
          localStorage.setItem("accessToken", token);
          const user = response.data?.data?.user || response.data?.data;
          const role = user?.role || user?.user_role || (user?.isAdmin ? 'ADMIN' : '') || (user?.isSuperAdmin ? 'SUPER_ADMIN' : '');
          if (role) {
            console.log("Saving User Role:", role);
            localStorage.setItem("userRole", role);
          }
          if (user?.email) {
            localStorage.setItem("userEmail", user.email);
          }
          setSnackbar({
            open: true,
            message: "Login Successfully!",
            severity: "success",
          });
          setTimeout(() => {
            router.push("/admin-management");
          }, 1500);
        } else {
          console.warn("Available keys in response:", Object.keys(response.data || {}));
          console.error("Access Token NOT found. Response was:", response.data);
          setSnackbar({
            open: true,
            message: "Login succeeded but token missing. Please try again or contact support.",
            severity: "error",
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Login failed", error);
        setSnackbar({
          open: true,
          message: "Login failed. Please check your credentials.",
          severity: "error",
        });
        setLoading(false);
      }
    },
  });

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
        backgroundRepeat: "no-repeat",
        overflow: "hidden",

      }}
    >
      <Card
        sx={{
          width: 410,
          backdropFilter: "blur(8px)",
          background: "rgba(255, 255, 255, 0.2)",
          color: COLORS.WHITE,
          borderRadius: 4,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: `${scienceGothic.style.fontFamily} !important`,
                fontWeight: 600,
                color: COLORS.WHITE
              }}
            >
              Ship Gpt
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: `${scienceGothic.style.fontFamily} !important`,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.7)",
                mt: 1
              }}
            >
              Welcome back, please login
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: COLORS.
                    WHITE,
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: COLORS.WHITE,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  "&.Mui-focused": {
                    color: COLORS.WHITE,
                  },
                },
                "& input": {
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  backgroundColor: "transparent !important",
                  transition: "background-color 5000s ease-in-out 0s !important",
                  "&:-webkit-autofill": {
                    transition: "background-color 5000s ease-in-out 0s !important",
                    WebkitTextFillColor: `${COLORS.WHITE} !important`,

                    WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
                    backgroundColor: "transparent !important",
                    backgroundClip: "text !important",
                  },
                }
              }}
              fullWidth
              label="Email"
              id="email"
              InputLabelProps={{ shrink: true }}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.errors.email}
            />
            <TextField
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  color: COLORS.WHITE,
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: COLORS.WHITE,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  "&.Mui-focused": {
                    color: COLORS.WHITE,
                  },
                },
                "& input": {
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  backgroundColor: "transparent !important",
                  transition: "background-color 5000s ease-in-out 0s !important",
                  "&:-webkit-autofill": {
                    transition: "background-color 5000s ease-in-out 0s !important",
                    WebkitTextFillColor: `${COLORS.WHITE} !important`,
                    WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
                    backgroundColor: "transparent !important",
                    backgroundClip: "text !important",
                  },
                }
              }}
              fullWidth
              label="Password"
              id="password"
              placeholder=" "
              InputLabelProps={{ shrink: true }}
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.errors.password}
            />
            <Box textAlign="right" mt={1}>
              <Typography
                variant="body2"
                onClick={() => {
                  setForgotEmail(formik.values.email);
                  setOpenForgotModal(true);
                }}
                sx={{
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: COLORS.WHITE,
                  opacity: 0.8,
                  "&:hover": { opacity: 1, textDecoration: 'underline' }
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                py: 1.3,
                borderRadius: 3,
                background: COLORS.WHITE,
                color: COLORS.BLACK,
                fontWeight: 600,
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.9)",
                },
                fontFamily: `${scienceGothic.style.fontFamily} !important`,
              }}
            >
              Login
            </Button>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

          </form>
        </CardContent>
      </Card>
      <Modal
        open={openForgotModal}
        onClose={() => !forgotLoading && setOpenForgotModal(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Card
          sx={{
            width: 400,
            backdropFilter: "blur(12px)",
            background: "rgba(30, 30, 30, 0.85)",
            color: COLORS.WHITE,
            borderRadius: 4,
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            p: 3,
            outline: 'none'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: `${scienceGothic.style.fontFamily} !important`,
              fontWeight: 600,
              mb: 1,
              textAlign: 'center'
            }}
          >
            Forgot Password?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: `${scienceGothic.style.fontFamily} !important`,
              mb: 3,
              textAlign: 'center',
              opacity: 0.7
            }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Email Address"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              disabled={forgotLoading}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: COLORS.WHITE,
                  height: '56px',
                  borderRadius: '12px',
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                  "&.Mui-focused fieldset": { borderColor: COLORS.WHITE },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  "&.Mui-focused": { color: COLORS.WHITE },
                },
                "& input": {
                  padding: '16.5px 14px',
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={async () => {
                if (!forgotEmail) {
                  setSnackbar({
                    open: true,
                    message: "Please enter your email",
                    severity: "error",
                  });
                  return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(forgotEmail)) {
                  setSnackbar({
                    open: true,
                    message: "Please enter a valid email address",
                    severity: "error",
                  });
                  return;
                }
                setForgotLoading(true);
                try {
                  const res = await dispatch(forgotPassword({ email: forgotEmail }));
                  if (forgotPassword.fulfilled.match(res)) {
                    setSnackbar({
                      open: true,
                      message: (res.payload as any)?.message || "Password reset link sent to your email!",
                      severity: "success",
                    });
                    setOpenForgotModal(false);
                    setForgotEmail("");
                  } else {
                    const errorMsg = res.payload as string || "Failed to send reset link";
                    setSnackbar({
                      open: true,
                      message: errorMsg,
                      severity: "error",
                    });
                  }
                } catch (err) {
                  console.error("Forgot Password Error Block:", err);
                  setSnackbar({
                    open: true,
                    message: "An unexpected error occurred",
                    severity: "error",
                  });
                } finally {
                  setForgotLoading(false);
                }
              }}
              disabled={forgotLoading}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                background: COLORS.WHITE,
                color: COLORS.BLACK,
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                "&:hover": { background: "rgba(255,255,255,0.9)", transform: 'scale(1.02)' },
                transition: 'all 0.2s ease',
                fontFamily: `${scienceGothic.style.fontFamily} !important`,
              }}
            >
              {forgotLoading ? (
                <CircularProgress size={24} sx={{ color: COLORS.BLACK }} />
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <Button
              fullWidth
              onClick={() => setOpenForgotModal(false)}
              disabled={forgotLoading}
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                textTransform: 'none',
                fontSize: '0.9rem',
                fontFamily: `${scienceGothic.style.fontFamily} !important`,
                "&:hover": { color: COLORS.WHITE, background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }
              }}
            >
              Return to Login
            </Button>
          </Stack>
        </Card>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            fontFamily: scienceGothic.style.fontFamily,
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}