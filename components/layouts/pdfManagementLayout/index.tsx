"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/dashboardLayout";
import { shipControllers } from "@/api/ship";
import {
    Box,
    Typography,
    Button,
    Grid2 as Grid,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Stack,
    Snackbar,
    Alert,
    AlertColor,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { COLORS } from "@/utils/enum";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchShips } from "@/redux/slices/shipSlice";

const CATEGORIES = ["Compliance", "Crewing", "Mechanical"];

export default function PdfManagementLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const { ships, loading } = useSelector((state: RootState) => state.ship);

    const [dragActive, setDragActive] = useState(false);
    const [selectedShipId, setSelectedShipId] = useState<string>("");
    const [selectedCategory, setSelectedCategory] =
        useState<string>("Mechanical");
    const [uploading, setUploading] = useState(false);

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleCloseSnackbar = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const showMessage = (message: string, severity: AlertColor = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    // Fallback dummy files
    const [files, setFiles] = useState<any[]>([
        {
            id: 1,
            name: "Shipping_Manifest_Nov2025.pdf",
            size: "2.4 MB",
            date: "2025-11-20",
        },
        { id: 2, name: "User_Guide_v2.pdf", size: "1.1 MB", date: "2025-12-01" },
    ]);

    useEffect(() => {
        dispatch(fetchShips());
    }, [dispatch]);

    const handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!selectedShipId) {
            showMessage("Please select a ship first.", "error");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showMessage("File size must be 10 MB or less.", "error");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("shipId", selectedShipId);
        formData.append("type", selectedCategory.toUpperCase());

        try {
            const response = await shipControllers.uploadPdf(formData);
            console.log("Upload success:", response);

            setFiles((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    name: file.name,
                    size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
                    date: new Date().toISOString().split("T")[0],
                },
            ]);

            showMessage(`File "${file.name}" uploaded successfully!`);
        } catch (error: any) {
            console.error("Upload failed:", error);
            showMessage(
                error.response?.data?.message || "Failed to upload file.",
                "error"
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
        e.target.value = "";
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
        "& .MuiSelect-icon": { color: COLORS.TEXT_PRIMARY },
        "& .MuiInputBase-input": {
            fontFamily: "var(--font-primary) !important",
            color: COLORS.TEXT_PRIMARY,
        },
        "& .MuiMenuItem-root": { fontFamily: "var(--font-primary) !important" },
    };

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                        color: COLORS.TEXT_PRIMARY,
                        mb: 1,
                        fontFamily: "var(--font-primary)",
                    }}
                >
                    PDF Management
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ color: COLORS.TEXT_SECONDARY, fontFamily: "var(--font-primary)" }}
                >
                    Upload and manage your PDF documents by selecting a ship and category.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Upload Area */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: "15px",
                            bgcolor: COLORS.WHITE,
                            border: `1px solid ${COLORS.FOREGROUND}`,
                            mb: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ mb: 3, fontFamily: "var(--font-primary)" }}
                        >
                            Upload Configuration
                        </Typography>
                        <Stack spacing={3}>
                            <FormControl fullWidth sx={textFieldStyle}>
                                <InputLabel id="ship-select-label">Select Ship</InputLabel>
                                <Select
                                    labelId="ship-select-label"
                                    value={selectedShipId}
                                    label="Select Ship"
                                    onChange={(e) => setSelectedShipId(e.target.value)}
                                >
                                    {loading ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} sx={{ mr: 1 }} /> Loading
                                            ships...
                                        </MenuItem>
                                    ) : (
                                        ships.map((ship: any) => (
                                            <MenuItem
                                                key={ship._id || ship.id}
                                                value={ship._id || ship.id}
                                            >
                                                {ship.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={textFieldStyle}>
                                <InputLabel id="category-select-label">Category</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    value={selectedCategory}
                                    label="Category"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Paper>

                    <Paper
                        elevation={0}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        sx={{
                            p: 6,
                            border: `2px dashed ${dragActive ? COLORS.ACCENT : COLORS.FOREGROUND
                                }`,
                            bgcolor: dragActive ? "rgba(0, 82, 224, 0.05)" : COLORS.WHITE,
                            borderRadius: "15px",
                            textAlign: "center",
                            cursor: selectedShipId ? "pointer" : "not-allowed",
                            transition: "all 0.3s ease",
                            opacity: selectedShipId ? 1 : 0.6,
                        }}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: "none" }}
                            accept=".pdf"
                            onChange={handleChange}
                            disabled={!selectedShipId || uploading}
                        />
                        <label
                            htmlFor="file-upload"
                            style={{
                                width: "100%",
                                height: "100%",
                                cursor: selectedShipId ? "pointer" : "not-allowed",
                            }}
                        >
                            <CloudUploadIcon
                                sx={{
                                    fontSize: 64,
                                    color: dragActive ? COLORS.ACCENT : COLORS.TEXT_SECONDARY,
                                    mb: 2,
                                }}
                            />
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                gutterBottom
                                sx={{ fontFamily: "var(--font-primary)" }}
                            >
                                {uploading ? "Uploading..." : "Drag & Drop PDF here"}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: COLORS.TEXT_SECONDARY,
                                    mb: 3,
                                    fontFamily: "var(--font-primary)",
                                }}
                            >
                                {selectedShipId
                                    ? "or click to browse files"
                                    : "Please select a ship above to enable upload"}
                            </Typography>
                            <Button
                                variant="contained"
                                component="span"
                                disabled={!selectedShipId || uploading}
                                sx={{
                                    borderRadius: "10px",
                                    bgcolor: COLORS.ACCENT,
                                    color: COLORS.WHITE,
                                    textTransform: "none",
                                    px: 4,
                                    py: 1,
                                    fontFamily: "var(--font-primary)",
                                    "&:hover": { bgcolor: "#0052E0" },
                                }}
                            >
                                {uploading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Browse Files"
                                )}
                            </Button>
                        </label>
                    </Paper>
                </Grid>

                {/* File List */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            border: `1px solid ${COLORS.FOREGROUND}`,
                            borderRadius: "15px",
                            bgcolor: COLORS.WHITE,
                            overflow: "hidden",
                        }}
                    >
                        <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.FOREGROUND}` }}>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{ fontFamily: "var(--font-primary)" }}
                            >
                                Recently Uploaded ({files.length})
                            </Typography>
                        </Box>

                        <List sx={{ p: 0 }}>
                            {files.map((file, index) => (
                                <Box key={file.id}>
                                    <ListItem sx={{ py: 2.5, px: 3 }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor: "rgba(0, 82, 224, 0.1)",
                                                    color: COLORS.ACCENT,
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <PictureAsPdfIcon />
                                            </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={file.name}
                                            secondary={
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: COLORS.TEXT_SECONDARY,
                                                        fontFamily: "var(--font-primary)",
                                                    }}
                                                >
                                                    {file.size} • {file.date}
                                                </Typography>
                                            }
                                            primaryTypographyProps={{
                                                fontWeight: 600,
                                                color: COLORS.TEXT_PRIMARY,
                                                fontFamily: "var(--font-primary)",
                                            }}
                                        />

                                        <IconButton
                                            sx={{ color: COLORS.TEXT_SECONDARY, mr: 1 }}
                                            onClick={() => showMessage(`Downloading "${file.name}"...`)}
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                        <IconButton
                                            sx={{ color: "#FF4D4F" }}
                                            onClick={() => {
                                                setFiles(files.filter((f) => f.id !== file.id));
                                                showMessage("File deleted successfully!");
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>

                                    {index < files.length - 1 && (
                                        <Divider sx={{ mx: 3, borderColor: COLORS.FOREGROUND }} />
                                    )}
                                </Box>
                            ))}

                            {files.length === 0 && (
                                <Box sx={{ p: 6, textAlign: "center" }}>
                                    <Typography
                                        sx={{
                                            color: COLORS.TEXT_SECONDARY,
                                            fontFamily: "var(--font-primary)",
                                        }}
                                    >
                                        No files found for the selected ship.
                                    </Typography>
                                </Box>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        width: "100%",
                        fontFamily: "var(--font-primary)",
                        fontWeight: 600,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </DashboardLayout>
    );
}