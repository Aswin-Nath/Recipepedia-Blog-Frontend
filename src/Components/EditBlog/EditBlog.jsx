import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CreateBlogNavbar from "../CreateBlogNavbar/CreateBlogNavbar";
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
    Box
} from '@mui/material';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import './EditBlog.css';

const EditBlog = () => {
    const navigate = useNavigate();
    const [image_urls,set_image_urls]=useState([]);
    const { blog_id } = useParams();
    const [blog,setBlog]=useState([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [videoUploadProgress, setVideoUploadProgress] = useState(0);
    // const []
      useEffect(()=>{
    const fetchImages= async ()=>{
      try{
        const API=`http://127.0.0.1:5000/api/get/blogs/images/${blog_id}`;
        const response=await axios.get(API);
        const urls=response.data.image_urls;
        console.log("IMAGE URLS",urls);
        set_image_urls(urls);
      }
      catch(error){
        console.log("Error occurred",error);
      }
    }
    fetchImages();
  },[blog_id])

  useEffect(()=>{
    const fetchVideos=async ()=>{
      try{
        const API=`http://127.0.0.1:5000/api/get/blogs/videos/${blog_id}`;
        // console.log("VIDEO",blog_id);
        const response=await axios.get(API);

        const urls=response.data.video_url;
        if(response?.data?.video_url?.[0]?.length>0){
            console.log(urls[0].length);
            setVideoUrl(urls[0]);   
        }
      }
      catch(error){
        console.log("Error occured",error);
      }
    }
    fetchVideos();
  },[blog_id]);
    useEffect(()=>{
        const fetchBlogData=async ()=>{
            try{
                const API=`http://127.0.0.1:5000/api/blogs/${blog_id}`;
                const response=await axios.get(API);
                setBlog(response.data.blog[0]);
            }
            catch(error){
                console.log("Error occured while fetching Blog data",error);
            }
        }
        fetchBlogData();
    },[])    
    const [delete_image_id,setdelete_image]=useState([]);
    const [delete_video,setdelete_video]=useState(false);
    const [formData, setFormData] = useState({
            title:"",
            difficulty:"",
            ingredients: [],
            categories: [],
            content: '',
            images: []  
        });
    useEffect(()=>{
        setFormData({
            title: blog.title || '',
            difficulty: blog.difficulty || '',
            ingredients: blog.ingredients || [],
            categories: blog.categories || [],
            content: blog.content || '',
            images: []
        });
    },[blog])

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imagePreviews, setImagePreviews] = useState([]);

    const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Expert'];
    const categoryOptions = ['Indian', 'Italian', 'Chinese', 'Quick', 'Spicy', 'Vegetarian'];
    


    useEffect(()=>{
        var tem=[];
        for(let i=0;i<image_urls.length;i++){
            tem.push({url:image_urls[i].image_url,type:"old",image_id:image_urls[i].image_id});
        }
        setImagePreviews(tem);
    },[image_urls])

    const handleIngredientsChange = (e) => {
        const ingredients = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, ingredients }));
    };

    
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, []);

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
        setdelete_video(true);
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
        let tem=[];
        for(let i=0;i<validFiles.length;i++){
            const url=URL.createObjectURL(validFiles[i]);
            tem.push({url:url,type:"new"});
        }
        setImagePreviews(prev => [...prev, ...tem]);
    };

    const removeImage = (index) => {
        if(imagePreviews[index].type==="old"){
            console.log(imagePreviews[index]);
            setdelete_image(prev=>[...prev,imagePreviews[index].image_id]);   
        }
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

    console.log(delete_image_id,imagePreviews);

    try {
        await axios.put(`http://localhost:5000/api/blogs/${blog.blog_id}`, {
            title: formData.title.trim(),
            content: formData.content.trim(),
            difficulty: formData.difficulty,
            ingredients: formData.ingredients,
            categories: formData.categories
        });

        let imageUrls = [];
        if(delete_image_id.length>0){
            const API="http://localhost:5000/api/edit/blogs/images";
            await axios.put(API,{delete_image_id});
        }
        if (formData.images.length > 0) {
            imageUrls = await uploadImages();
            
            await Promise.all(imageUrls.map(url => 
                axios.post('http://localhost:5000/api/blogs/images', {
                    blog_id: blog.blog_id,
                    image_url: url
                })
            ));
        }
        if(delete_video){
            await  axios.put("http://localhost:5000/api/edit/blogs/videos",{blog_id});
        }
        if(videoUrl){
            const API="http://localhost:5000/api/blogs/videos";
            await axios.post(API,{blog_id:blog_id,video_url:videoUrl},{headers:{"Content-Type":"application/json"}});
        }
        setSuccessMessage('Recipe updated successfully!');
        setTimeout(() => {
            navigate('/home');

        }, 1500);
    } catch (err) {
        setError(err.response?.data?.error || 'Failed to update recipe. Please try again.');
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
                <h1>Edit Recipe</h1>
                <form  className="recipe-form">
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
                                            src={preview.url} 
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
                        disabled={videoUrl.length>0}
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

                {videoUrl.length>0 && (
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
                            onClick={handleSubmit}
                            color="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                blog.status === "Draft" ? "Upload Recipe" : "Update Recipe"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlog;