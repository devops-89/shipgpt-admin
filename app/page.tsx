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
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { scienceGothic } from "@/utils/fonts";
import { COLORS } from "@/utils/enum";
import { useFormik } from "formik";
import { loginValidationSchema } from "@/utils/validationSchema";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
     onSubmit: async (values) => {
  try {
    const response = await authControllers.login(values);
    localStorage.setItem(
      "accessToken",
      response.data.data.accessToken
    );
    router.push("/dashboard");
  } catch (error) {
    console.error("Login failed", error);
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
          background: "rgba(255, 255, 255, 0.15)", 
          color: COLORS.WHITE,
          borderRadius: 4,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          border: `1px solid ${COLORS.ACCENT}`
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
                }
              }}
              fullWidth
              label="Email"
              id="email"
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
                }
              }}
              fullWidth
              label="Password"
              id="password"
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
                sx={{
                  fontFamily: `${scienceGothic.style.fontFamily} !important`,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: COLORS.WHITE,
                  opacity: 0.8,
                  "&:hover": { opacity: 1 }
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
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
