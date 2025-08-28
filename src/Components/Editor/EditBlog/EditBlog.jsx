import { useState, useEffect } from 'react';
import { data, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CreateBlogNavbar from "../../Navbars/CreateBlogNavbar/CreateBlogNavbar";
import Avatar from '@mui/material/Avatar'; // Add at the top if not present

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
import { useUser } from '../../Contexts/ContextProvider';
const EditBlog = () => {
    const navigate = useNavigate();
    const {userId}=useUser();

    const [image_urls,set_image_urls]=useState([]);
    const { blog_id } = useParams();
    const [blog,setBlog]=useState([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [date,setdate]=useState("");
    const [time,settime]=useState("");
    const [videoUploadProgress, setVideoUploadProgress] = useState(0);
    const [showScheduleFields, setShowScheduleFields] = useState(false);
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [type,settype]=useState("Draft");

    // Add these states near your other useState hooks:
    const [mentions, setMentions] = useState([]);
    const [mentionQuery, setMentionQuery] = useState('');
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [isMentionInputFocused, setIsMentionInputFocused] = useState(false);

    // Fetch users for mentions
    const fetchUsers = async (query) => {
        if (!query) return [];
        try {
            const API1=`http://127.0.0.1:5000/api/users/search?q=${query}`;
            const API2=`https://recipepedia-blog-backend.onrender.com/api/users/search?q=${query}`;
            const res = await axios.get(API2);
            console.log(res.data.users);
            return res.data.users || [];
        } catch {
            return [];
        }
    };

    useEffect(() => {
        let active = true;
        if (mentionQuery.trim() === '') {
            setUserSuggestions([]);
            return;
        }
        fetchUsers(mentionQuery).then(users => {
            if (active) setUserSuggestions(users.filter(u => !mentions.some(m => m.id === u.id)));
        });
        return () => { active = false; };
    }, [mentionQuery, mentions]);

    const handleAddMention = (user) => {
        setMentions(prev => [...prev, user]);
        setMentionQuery('');
        setUserSuggestions([]);
    };

    const handleRemoveMention = (userId) => {
        setMentions(prev => prev.filter(u => u.id !== userId));
    };

        const handleScheduleClick = () => {
            setShowScheduleFields((prev) => !prev);
        };
    
        const handleScheduleSave = async () => {
            if (scheduledDate && scheduledTime) {
                try {
                    
                    await axios.post('https://recipepedia-blog-backend.onrender.com/api/post/schedule_blog', {
                            blog_id,
                            date: scheduledDate,
                            time: scheduledTime
                        });
                    setShowScheduleFields(false);
                    settype("Hold");
                } catch (error) {
                    setError('Failed to schedule blog: ' + (error.response?.data?.message || error.message));
                }
            }
        };
    
    // const []
      useEffect(()=>{
    const fetchImages= async ()=>{
      try{
        const API=`https://recipepedia-blog-backend.onrender.com/api/get/blogs/images/${blog_id}`;
        const response=await axios.get(API);
        const urls=response.data.image_urls;
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
        const API=`https://recipepedia-blog-backend.onrender.com/api/get/blogs/videos/${blog_id}`;
        const response=await axios.get(API);

        const urls=response.data.video_url;
        if(response?.data?.video_url?.[0]?.length>0){
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

                const API1=`https://recipepedia-blog-backend.onrender.com/api/blogs/${blog_id}`;
                const API2=`http://127.0.0.1:5000/api/blogs/${blog_id}`;
                const response=await axios.get(API1);
                setBlog(response.data.blog);
                console.log(response.data.blog);
                console.log(response.data.mentions);
                setMentions(response.data.mentions);
                if(response.data.blog.status=="Hold"){
                    const time_date_response=await axios.get("https://recipepedia-blog-backend.onrender.com/api/get/scheduled_time",{params:{blog_id}});
                    setdate(time_date_response.data.date);
                    settime(time_date_response.data.time);
                }
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
        const ingredients = e.target.value;
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
                    'https://image-upload-backend-v12y.onrender.com/upload',
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
const handleSubmit = async (e,athu) => {
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
        const API1="http://127.0.0.1:5000/api/blogs/";
        const API2="https://recipepedia-blog-backend.onrender.com/api/blogs/";
        await axios.put(`${API2}${blog.blog_id}`, {
            title: formData.title.trim(),
            content: formData.content.trim(),
            difficulty: formData.difficulty,
            ingredients: Array.isArray(formData.ingredients)
                ? formData.ingredients
                : (typeof formData.ingredients === "string"
                    ? (formData.ingredients.includes(",")
                        ? formData.ingredients.split(",").map(i => i.trim()).filter(i => i)
                        : formData.ingredients.trim() ? [formData.ingredients.trim()] : [])
                    : []),
            categories: formData.categories,
            status: athu,
            userId,mentions
        });

        let imageUrls = [];
        if(delete_image_id.length>0){
            const API="https://recipepedia-blog-backend.onrender.com/api/edit/blogs/images";
            await axios.put(API,{delete_image_id});
        }
        if (formData.images.length > 0) {
            imageUrls = await uploadImages();
            
            await Promise.all(imageUrls.map(url => 
                axios.post('https://recipepedia-blog-backend.onrender.com/api/blogs/images', {
                    blog_id: blog.blog_id,
                    image_url: url
                })
            ));
        }
        if(delete_video){
            await  axios.put("https://recipepedia-blog-backend.onrender.com/api/edit/blogs/videos",{blog_id});
        }
        if(videoUrl){
            const API="https://recipepedia-blog-backend.onrender.com/api/blogs/videos";
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
            <div className='time-displayer'>
                {blog.status === "Hold" && (
                <div>
                    <h1>Scheduled on</h1>
                    <h3>{new Date(date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                    })}</h3>
                    <h3>{new Date(`1970-01-01T${time}`).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                    })}</h3>
                </div>
                )}
            </div>
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
                        value={formData.ingredients}
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

                                        {/* Mentions Section */}
                    <div className="mentions-section" style={{ marginTop: 24, marginBottom: 16 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Mentions</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {mentions.length === 0 && (
                                <Typography variant="body2" color="text.secondary">No mentions yet.</Typography>
                            )}
                            {mentions.map(user => (
                                <Chip
                                    key={user.id}
                                    avatar={<Avatar src={user.avatar} />}
                                    label={user.name}
                                    onDelete={() => handleRemoveMention(user.id)}
                                    sx={{ mb: 1 }}
                                />
                            ))}
                        </Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Add Mentions</Typography>
                        <Box sx={{ position: 'relative', width: '100%' }}>
                            <TextField
                                fullWidth
                                placeholder="Type to search users to mention..."
                                value={mentionQuery}
                                onChange={e => setMentionQuery(e.target.value)}
                                onFocus={() => setIsMentionInputFocused(true)}
                                onBlur={() => setTimeout(() => setIsMentionInputFocused(false), 200)}
                                size="small"
                                onKeyDown={e => {
                                    if (
                                        e.key === 'Enter' &&
                                        userSuggestions.length > 0
                                    ) {
                                        e.preventDefault();
                                        handleAddMention(userSuggestions[0]);
                                    }
                                }}
                            />
                            {userSuggestions.length > 0 && (
                                <Box sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    mt: 1,
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                    bgcolor: 'background.paper',
                                    zIndex: 10,
                                    position: 'absolute',
                                    width: '100%'
                                }}>
                                    {userSuggestions.map(user => (
                                        <Box
                                            key={user.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                px: 1,
                                                py: 1,
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: '#f5f5f5' }
                                            }}
                                            onMouseDown={() => handleAddMention(user)}
                                        >
                                            <Avatar src={user.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                                            <Typography variant="body2">{user.name}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </div>

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
                            onClick={(e) => {
                                e.preventDefault();
                                const statusToSend = blog.status === "Draft" ? (type=="Draft"?"Publish":"Hold") : blog.status;
                                handleSubmit(e, statusToSend);
                            }}
                            color="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                blog.status === "Draft" ? "Upload Recipe" : "Update Recipe"
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
                                        onClick={()=>{
                                            setdate(scheduledDate);
                                            settime(scheduledTime);
                                            handleScheduleSave();
                                        }}
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

export default EditBlog;