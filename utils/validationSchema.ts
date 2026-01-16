import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email().required("Please Enter Valid Email").trim(),
  password: Yup.string()
    .required("Please Enter Valid Password")
    .min(6, "Password must be 6 characters")
    .max(15, "Password should not be larger than 15 characters"),
});

export const resetPasswordValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{4}$/, "OTP must be exactly 4 digits"),
  newPassword: Yup.string()
    .required("New Password is required")
    .min(6, "Password must be at least 6 characters")
});
