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
    ListItemSecondaryAction,
    Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

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
        // Limit file size to 10 MB
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
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: 'var(--foreground)' }}>
                    PDF Management
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                    Upload and manage your PDF documents here.
                </Typography>
            </Box>

            <Grid container spacing={3}>
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
                            border: `2px dashed ${dragActive ? 'var(--foreground)' : 'var(--border)'}`,
                            bgcolor: dragActive ? 'rgba(255,255,255,0.05)' : 'var(--card-bg)',
                            borderRadius: 0,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: "none" }}
                            accept=".pdf"
                            onChange={handleChange}
                        />
                        <label htmlFor="file-upload" style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
                            <CloudUploadIcon sx={{ fontSize: 64, color: "var(--foreground)", mb: 2 }} />
                            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "var(--foreground)" }}>
                                Drag & Drop PDF here
                            </Typography>
                            <Typography variant="body2" sx={{ color: "var(--foreground)", mb: 3 }}>
                                or click to browse files
                            </Typography>
                            <Button
                                variant="contained"
                                component="span"
                                sx={{
                                    borderRadius: 0,
                                    bgcolor: 'var(--foreground)',
                                    color: 'var(--background)',
                                    '&:hover': { bgcolor: 'var(--text-secondary)' }
                                }}
                            >
                                Browse Files
                            </Button>
                        </label>
                    </Paper>
                </Grid>

                {/* File List */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: 0, bgcolor: 'var(--card-bg)' }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
                            <Typography variant="h6" fontWeight={600} sx={{ color: "var(--foreground)" }}>Uploaded Files ({files.length})</Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                            {files.map((file, index) => (
                                <Box key={file.id}>
                                    <ListItem sx={{ py: 2 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'var(--foreground)', borderRadius: 0 }}>
                                                <PictureAsPdfIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={file.name}
                                            secondary={<Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>{file.size} • {file.date}</Typography>}
                                            primaryTypographyProps={{ fontWeight: 500, color: 'var(--foreground)' }}
                                        />
                                        <ListItem>
                                            <IconButton edge="end" sx={{ color: 'var(--foreground)', mr: 1 }}>
                                                <DownloadIcon />
                                            </IconButton>
                                            <IconButton edge="end" sx={{ color: 'var(--foreground)' }} onClick={() => {
                                                setFiles(files.filter(f => f.id !== file.id));
                                                toast.success("File deleted successfully!");
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    </ListItem>
                                    {index < files.length - 1 && <Divider sx={{ borderColor: 'var(--border)' }} />}
                                </Box>
                            ))}
                            {files.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">No files uploaded yet.</Typography>
                                </Box>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}
