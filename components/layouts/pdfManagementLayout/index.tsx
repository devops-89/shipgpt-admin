"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/dashboardLayout";
import { toast } from "react-toastify";
import { shipControllers } from "@/api/ship";
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { COLORS } from "@/utils/enum";

export default function PdfManagementLayout() {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<any[]>([
        { id: 1, name: "Shipping_Manifest_Nov2025.pdf", size: "2.4 MB", date: "2025-11-20" },
        { id: 2, name: "User_Guide_v2.pdf", size: "1.1 MB", date: "2025-12-01" },
    ]);

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

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be 10 MB or less.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("shipId", "3");
        formData.append("type", "MECHANICAL");

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        try {
            const response = await shipControllers.uploadPdf(formData);
            console.log("Upload success:", response);

            setFiles(prev => [...prev, {
                id: Date.now(),
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + "MB",
                date: new Date().toISOString().split('T')[0]
            }]);

            toast.success(`File "${file.name}" uploaded successfully!`);
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload file.");
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

        console.log("File input changed");
        if (e.target.files && e.target.files[0]) {
            console.log("File found:", e.target.files[0].name);
            handleFileUpload(e.target.files[0]);
        }

        e.target.value = '';
    };

    return (
        <DashboardLayout>
            <Box sx={{
                bgcolor: COLORS.LIGHT_BACKGROUND,
                minHeight: "100vh",
                p: 4,
                borderRadius: 2
            }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: COLORS.TEXT_PRIMARY, mb: 1 }}>
                        PDF Management
                    </Typography>
                    <Typography variant="body1" sx={{ color: COLORS.TEXT_SECONDARY }}>
                        Upload and manage your PDF documents.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Upload Area */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper
                            elevation={0}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            sx={{
                                p: 6,
                                border: `2px dashed ${dragActive ? COLORS.PRIMARY_BLUE : COLORS.GRAY_BORDER}`,
                                bgcolor: dragActive ? COLORS.PRIMARY_BLUE : COLORS.WHITE,
                                borderRadius: 4,
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: 400,
                                "&:hover": {
                                    borderColor: COLORS.PRIMARY_BLUE,
                                    transform: "translateY(-4px)"
                                }
                            }}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                style={{ display: "none" }}
                                accept=".pdf"
                                onChange={handleChange}
                            />
                            <label htmlFor="file-upload" style={{ width: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{
                                    p: 3,
                                    borderRadius: "50%",
                                    bgcolor: dragActive ? "rgba(255,255,255,0.2)" : "rgba(22, 93, 255, 0.1)",
                                    mb: 3
                                }}>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: dragActive ? COLORS.WHITE : COLORS.PRIMARY_BLUE }} />
                                </Box>
                                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: dragActive ? COLORS.WHITE : COLORS.TEXT_PRIMARY }}>
                                    Upload PDF
                                </Typography>
                                <Typography variant="body2" sx={{ color: dragActive ? COLORS.WHITE : COLORS.TEXT_SECONDARY, mb: 4, maxWidth: 250, opacity: dragActive ? 0.9 : 1 }}>
                                    Drag and drop your file here or click to browse
                                </Typography>
                                <Button
                                    variant="contained"
                                    component="span"
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: dragActive ? COLORS.WHITE : COLORS.PRIMARY_BLUE,
                                        color: dragActive ? COLORS.PRIMARY_BLUE : COLORS.WHITE,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 600,
                                        textTransform: "none",
                                        boxShadow: "none",
                                        '&:hover': {
                                            bgcolor: dragActive ? "rgba(255,255,255,0.9)" : COLORS.PRIMARY_BLUE,
                                            boxShadow: "0px 4px 12px rgba(22, 93, 255, 0.4)"
                                        }
                                    }}
                                >
                                    Browse Files
                                </Button>
                            </label>
                        </Paper>
                    </Grid>

                    {/* File List */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper elevation={0} sx={{
                            borderRadius: 4,
                            bgcolor: COLORS.WHITE,
                            overflow: 'hidden',
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)"
                        }}>
                            <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.GRAY_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight={700} sx={{ color: COLORS.TEXT_PRIMARY }}>Uploaded Files</Typography>
                                <Box sx={{ px: 2, py: 0.5, bgcolor: "rgba(22, 93, 255, 0.1)", borderRadius: 10 }}>
                                    <Typography variant="caption" fontWeight={700} sx={{ color: COLORS.PRIMARY_BLUE }}>
                                        {files.length} FILES
                                    </Typography>
                                </Box>
                            </Box>
                            <List sx={{ p: 0 }}>
                                {files.map((file, index) => (
                                    <Box key={file.id}>
                                        <ListItem sx={{ py: 2.5, px: 3, '&:hover': { bgcolor: "rgba(22, 93, 255, 0.02)" } }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: "rgba(22, 93, 255, 0.1)", color: COLORS.PRIMARY_BLUE, borderRadius: 2 }}>
                                                    <PictureAsPdfIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={file.name}
                                                secondary={
                                                    <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, mt: 0.5, display: 'block' }}>
                                                        {file.size} • Uploaded on {file.date}
                                                    </Typography>
                                                }
                                                primaryTypographyProps={{ fontWeight: 600, color: COLORS.TEXT_PRIMARY }}
                                            />
                                            <ListItem>
                                                <IconButton sx={{
                                                    color: COLORS.TEXT_SECONDARY,
                                                    mr: 1,
                                                    '&:hover': { color: COLORS.PRIMARY_BLUE, bgcolor: "rgba(22, 93, 255, 0.1)" }
                                                }}>
                                                    <DownloadIcon />
                                                </IconButton>
                                                <IconButton sx={{
                                                    color: COLORS.TEXT_SECONDARY,
                                                    '&:hover': { color: COLORS.RED, bgcolor: "rgba(239, 68, 68, 0.1)" }
                                                }} onClick={() => {
                                                    setFiles(files.filter(f => f.id !== file.id));
                                                    toast.success("File deleted successfully!");
                                                }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItem>
                                        </ListItem>
                                        {index < files.length - 1 && <Divider sx={{ borderColor: COLORS.GRAY_BORDER, opacity: 0.5 }} />}
                                    </Box>
                                ))}
                                {files.length === 0 && (
                                    <Box sx={{ p: 6, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{ p: 3, bgcolor: COLORS.LIGHT_BACKGROUND, borderRadius: "50%", mb: 2 }}>
                                            <PictureAsPdfIcon sx={{ fontSize: 40, color: COLORS.TEXT_SECONDARY }} />
                                        </Box>
                                        <Typography variant="h6" fontWeight={600} sx={{ color: COLORS.TEXT_PRIMARY, mb: 1 }}>No files found</Typography>
                                        <Typography variant="body2" sx={{ color: COLORS.TEXT_SECONDARY, maxWidth: 300 }}>
                                            Upload your PDF documents to manage them here.
                                        </Typography>
                                    </Box>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </DashboardLayout>
    );
}
