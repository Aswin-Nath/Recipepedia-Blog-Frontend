import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateBlogNavbar from "../../Navbars/CreateBlogNavbar/CreateBlogNavbar";
import { useUser } from '../../Contexts/ContextProvider';
import { 
    TextField, 
    Button, 
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    CircularProgress,
    Alert,
    LinearProgress,
    Typography,
    IconButton,
    Box,
} from '@mui/material';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import './CreateBlog.css';

const CreateBlog = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { userId } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [blog_id,setblog_id]=useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [showScheduleFields, setShowScheduleFields] = useState(false);
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    const handleScheduleClick = () => {
        setShowScheduleFields((prev) => !prev);
    };

    const handleScheduleSave = async () => {
        if (scheduledDate && scheduledTime) {
    try {
        const validationErrors = validateForm();
        
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '));
            return;
        }
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        let imageUrls = [];
        if (formData.images.length > 0) {
            imageUrls = await uploadImages();
        }
        const blogResponse = await axios.post('https://recipepedia-blog-backend.onrender.com/api/blogs', {
            title: formData.title.trim(),
            content: formData.content.trim(),
            user_id: userId,
            difficulty: formData.difficulty,
            ingredients: formData.ingredients,
            categories: formData.categories,
            type:"Hold",
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
        );
        setblog_id(blogResponse.data.blog_id);
        if (imageUrls.length > 0) {
            await Promise.all(imageUrls.map(url=>
                axios.post('https://recipepedia-blog-backend.onrender.com/api/blogs/images', {
                    blog_id: blogResponse.data.blog_id,
                    image_url: url
                })
            ));
        }
        if(videoUrl){
            try{
                const API="https://recipepedia-blog-backend.onrender.com/api/blogs/videos";
                axios.post(API,{blog_id:blogResponse.data.blog_id,video_url:videoUrl},{headers:{"Content-Type":"application/json"}});
            }
            catch(error){
                console.log("error occured while adding",error.message);
            }
        }
        await axios.post('https://recipepedia-blog-backend.onrender.com/api/post/schedule_blog', {
                blog_id:blogResponse.data.blog_id,
                date: scheduledDate,
                time: scheduledTime
            });
            setSuccessMessage('Blog scheduled successfully!');
            setShowScheduleFields(false);
            setTimeout(() => {
                navigate('/home');
            }, 1500);
            } catch (error) {
                setError('Failed to schedule blog: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const [formData, setFormData] = useState({
        title: '',
        difficulty: '',
        ingredients: [],
        categories: [],
        content: '',
        images: []
    });
    const [postType,setpostType]=useState("Publish");

    const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Expert'];
    const categoryOptions = ['Indian', 'Italian', 'Chinese', 'Quick', 'Spicy', 'Vegetarian'];

    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    const handleIngredientsChange = (e) => {
        const ingredients = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, ingredients }));
    };
const [videoUrl, setVideoUrl] = useState('');
const [videoUploadProgress, setVideoUploadProgress] = useState(0);

const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
        setError('Video size must be less than 100MB');
        return;
    }

    
    const formData = new FormData();
    formData.append('video', file);
    formData.append('video_name', `recipe_video_${Date.now()}`);

    try {
        setVideoUploadProgress(0);
        const response = await axios.post(
            'https://image-upload-backend-v12y.onrender.com/upload-video',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    setVideoUploadProgress(progress);
                }
            }
        );
        setVideoUrl(response.data.url);
        setFormData(prev => ({ ...prev, video_url: response.data.url }));
    } catch (error) {
        setError('Failed to upload video: ' + error.message);
        console.error('Video upload error:', error);
    } finally {
        setVideoUploadProgress(0);
    }
};

const removeVideo = () => {
    // setSelectedVideo(null);
    setVideoUrl('');
    setFormData(prev => ({ ...prev, video_url: '' }));
};

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (validFiles.length !== files.length) {
            setError('Please select only image files');
            return;
        }

        setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, ...validFiles]
        }));
        
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const uploadImages = async () => {
        const uploadedUrls = [];
        setUploadProgress(0);

        for (let i = 0; i < formData.images.length; i++) {
            const imageFormData = new FormData();
            imageFormData.append('image', formData.images[i]);
            imageFormData.append('image_name', `recipe_${Date.now()}_${i}`);

            try {
                const response = await axios.post(
                    'https://image-upload-backend-v12y.onrender.com/upload-image',
                    imageFormData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (progressEvent) => {
                            const progress = ((i + (progressEvent.loaded / progressEvent.total)) / formData.images.length) * 100;
                            setUploadProgress(progress);
                        }
                    }
                );
                uploadedUrls.push(response.data.url);
            } catch (error) {
                throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
            }
        }
        return uploadedUrls;
    };

    const validateForm = () => {
        const errors = [];
        if (!formData.title.trim()) errors.push('Title is required');
        if (!formData.content.trim()) errors.push('Recipe instructions are required');
        if (!formData.difficulty) errors.push('Difficulty level is required');
        if (formData.ingredients.length === 0) errors.push('At least one ingredient is required');
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '));
            return;
        }
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            let imageUrls = [];
            if (formData.images.length > 0) {
                imageUrls = await uploadImages();
            }
            const blogResponse = await axios.post('https://recipepedia-blog-backend.onrender.com/api/blogs', {
                title: formData.title.trim(),
                content: formData.content.trim(),
                user_id: userId,
                difficulty: formData.difficulty,
                ingredients: formData.ingredients,
                categories: formData.categories,
                type:postType
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );
            setblog_id(blogResponse.data.blog_id);
            if (imageUrls.length > 0) {
                await Promise.all(imageUrls.map(url=>
                    axios.post('https://recipepedia-blog-backend.onrender.com/api/blogs/images', {
                        blog_id: blogResponse.data.blog_id,
                        image_url: url
                    })
                ));
            }
            if(videoUrl){
                try{
                    const API="https://recipepedia-blog-backend.onrender.com/api/blogs/videos";
                    axios.post(API,{blog_id:blogResponse.data.blog_id,video_url:videoUrl},{headers:{"Content-Type":"application/json"}});
                }
                catch(error){
                    console.log("error occured while adding",error.message);
                }
            }

            setSuccessMessage('Recipe posted successfully!');
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create recipe. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    return (
        <div>
            <CreateBlogNavbar/>
            <div className="create-post-container">
                <h1>Create New Recipe</h1>
                <form onSubmit={handleSubmit} className="recipe-form">
                    <TextField
                        required
                        fullWidth
                        label="Recipe Title"
                        variant="outlined"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="form-field"
                        error={!formData.title && error}
                    />

                    <FormControl fullWidth required className="form-field">
                        <InputLabel>Difficulty Level</InputLabel>
                        <Select
                            value={formData.difficulty}
                            label="Difficulty Level"
                            onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                            error={!formData.difficulty && error}
                        >
                            {difficultyLevels.map(level => (
                                <MenuItem key={level} value={level}>{level}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <TextField
                        required
                        fullWidth
                        label="Ingredients (comma separated)"
                        variant="outlined"
                        multiline
                        rows={3}
                        value={formData.ingredients.join(', ')}
                        onChange={handleIngredientsChange}
                        className="form-field"
                        helperText="Enter ingredients separated by commas"
                        error={formData.ingredients.length === 0 && error}
                    />

                    <FormControl fullWidth className="form-field">
                        <InputLabel>Categories</InputLabel>
                        <Select
                            multiple
                            value={formData.categories}
                            label="Categories"
                            onChange={(e) => setFormData(prev => ({ ...prev, categories: e.target.value }))}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {categoryOptions.map(category => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className="image-upload-section">
                        <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="image-upload">
                            <Button
                                component="span"
                                variant="outlined"
                                startIcon={<ImageIcon />}
                                className="upload-button"
                            >
                                Upload Images
                            </Button>
                        </label>

                        {uploadProgress > 0 && (
                            <Box sx={{ width: '100%', mt: 2 }}>
                                <LinearProgress variant="determinate" value={uploadProgress} />
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                    Uploading: {Math.round(uploadProgress)}%
                                </Typography>
                            </Box>
                        )}

                        {imagePreviews.length > 0 && (
                            <div className="image-preview-grid">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="preview-container">
                                        <img 
                                            src={preview} 
                                            alt={`Preview ${index + 1}`}
                                            className="preview-image"
                                        />
                                        <IconButton
                                            className="remove-image-button"
                                            onClick={() => removeImage(index)}
                                            size="small"
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

            <div className="video-upload-section">
                <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    style={{ display: 'none' }}
                    onChange={handleVideoUpload}
                />
                <label htmlFor="video-upload">
                    <Button
                        component="span"
                        variant="outlined"
                        startIcon={<VideoFileIcon />}
                        className="upload-button"
                        disabled={!!videoUrl}
                    >
                        Upload Recipe Video
                    </Button>
                </label>

                


                {videoUploadProgress > 0 && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <LinearProgress variant="determinate" value={videoUploadProgress} />
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                            Uploading Video: {Math.round(videoUploadProgress)}%
                        </Typography>
                    </Box>
                )}

                {videoUrl && (
                    <div className="video-preview-container">
                        <video 
                            controls 
                            src={videoUrl}
                            className="video-preview"
                        />
                        <IconButton
                            className="remove-video-button"
                            onClick={removeVideo}
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                )}
            </div>

                    <TextField
                        required
                        fullWidth
                        label="Recipe Instructions"
                        variant="outlined"
                        multiline
                        rows={6}
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="form-field"
                        error={!formData.content && error}
                    />

                    {error && <Alert severity="error" className="alert">{error}</Alert>}
                    {successMessage && <Alert severity="success" className="alert">{successMessage}</Alert>}

                    <div className="form-actions">
                        <Button 
                            type="button" 
                            variant="outlined" 
                            onClick={() => navigate('/home')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && postType=="Publish" ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Post Recipe'
                            )}
                        </Button>
                        <Button
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={isSubmitting}
                            onClick={()=>{setpostType("Draft")}}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Save as Draft'
                            )}
                        </Button>
                            <Button
                                type="button"
                                variant="contained"
                                color="secondary"
                                disabled={isSubmitting}
                                onClick={handleScheduleClick}
                                style={{ marginLeft: 8 }}
                            >
                                &#128337; Schedule
                            </Button>
                           {showScheduleFields && (
                            <Box
                                sx={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    bgcolor: 'rgba(0,0,0,0.3)',
                                    zIndex: 1300,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: 'background.paper',
                                        p: 4,
                                        borderRadius: 2,
                                        boxShadow: 3,
                                        minWidth: 320,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 1 }}>Schedule Recipe Post</Typography>
                                   <TextField
                                        label="Date"
                                        type="date"
                                        size="small"
                                        value={scheduledDate}
                                        onChange={e => setScheduledDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{
                                            min: new Date().toISOString().split('T')[0]
                                        }}
                                    />
                                    <TextField
                                        label="Time (24hr)"
                                        type="time"
                                        size="small"
                                        value={scheduledTime}
                                        onChange={e => setScheduledTime(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{
                                            step: 60,
                                            min: scheduledDate === new Date().toISOString().split('T')[0]
                                                ? new Date().toTimeString().slice(0,5)
                                                : undefined
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleScheduleSave}
                                            disabled={!scheduledDate || !scheduledTime}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => setShowScheduleFields(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlog;