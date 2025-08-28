import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../Contexts/ContextProvider";
import Navbar from "../../Navbars/Navbar/Navbar";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  LinearProgress,
  Menu,
  MenuItem,
  IconButton
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import "./EditDetails.css";

const EditProfile = () => {
  const token = localStorage.getItem("token");
  const { userId, loading } = useUser();

  const [userName, setUserName] = useState("");
  const [userMail, setUserMail] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [removePhoto,setRemove]=useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // New states for hover and menu
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (loading || !userId) return;

    const fetchDetails = async () => {
      try {
        const res = await axios.get("https://recipepedia-blog-backend.onrender.com/api/user-details", {
          params: { userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = res.data.details[0];
        setUserName(user.user_name);
        setUserMail(user.user_mail);
        setProfileUrl(user.profile_url);
      } catch (error) {
        alert("Failed to load user details");
      }
    };
    fetchDetails();
  }, [userId, loading]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setProfileUrl(URL.createObjectURL(e.target.files[0]));
    setAnchorEl(null);
  };

  const uploadProfileImage = async () => {
    if (!imageFile) return profileUrl;

    const imageFormData = new FormData();
    imageFormData.append("image", imageFile);
    imageFormData.append("image_name", `profile_${Date.now()}`);

    const response = await axios.post(
      "https://image-upload-backend-v12y.onrender.com/upload",
      imageFormData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      }
    );
    setProfileUrl(response.data.url);
    return response.data.url;
  };
  const handleRemovePhoto=()=>{
    setRemove(removePhoto===true?false:true);
    setProfileUrl(undefined);
  }
  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      let uploadedUrl = profileUrl;
      if (imageFile) {
        uploadedUrl = await uploadProfileImage();
      }

      await axios.post(
        "https://recipepedia-blog-backend.onrender.com/api/update-user-details",
        {
          userId,
          user_name: userName,
          user_mail: userMail,
          profile_url: uploadedUrl,
          removePhoto
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileUrl(uploadedUrl);
      setImageFile(null);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Menu handlers
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // For file input
  const fileInputRef = useState(null);

  return (
    <>
      <Box className="edit-profile-container">
        <Typography variant="h5" mb={2}>
          Edit Profile
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: 120,
            height: 120,
            margin: "0 auto 16px auto",
            cursor: "pointer",
          }}
          onMouseEnter={() => setIsAvatarHovered(true)}
          onMouseLeave={() => setIsAvatarHovered(false)}
          onClick={handleAvatarClick}
        >
          <Avatar
            alt="Profile"
            src={profileUrl}
            sx={{ width: 120, height: 120 }}
          />
          {isAvatarHovered && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.6)",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                zIndex: 2,
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2" align="center">
                Change<br />profile photo
              </Typography>
            </Box>
          )}
        </Box>

        {/* Menu for avatar actions */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MenuItem
            onClick={() => {
              document.getElementById("profile-upload-input").click();
            }}
          >
            <UploadFileIcon sx={{ mr: 1 }} /> Upload photo
            <input
              id="profile-upload-input"
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setProfileUrl("");
              setImageFile(null);
              setAnchorEl(null);
            }}
          >
            <DeleteIcon onClick={handleRemovePhoto} sx={{ mr: 1 }} /> Remove photo
          </MenuItem>
        </Menu>

        <TextField
          label="Name"
          name="user_name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Email"
          name="user_mail"
          value={userMail}
          onChange={(e) => setUserMail(e.target.value)}
          fullWidth
          margin="normal"
        />

        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption">{Math.round(uploadProgress)}%</Typography>
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={isSaving}
          sx={{ mt: 3 }}
        >
          {isSaving ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </Box>
    </>
  );
};

export default EditProfile;