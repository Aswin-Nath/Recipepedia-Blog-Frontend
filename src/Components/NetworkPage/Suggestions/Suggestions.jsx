import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../Contexts/ContextProvider";

import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Box
} from "@mui/material";

const Suggestions = () => {
  const { userId } = useUser();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/suggestions/${userId}`);
      console.log(res.data[0]);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchSuggestions();
  }, [userId]);

  const handleConnect = async (targetId) => {
    try {
      await axios.post("http://localhost:5000/api/connect", {
        follower_id: userId,
        following_id: targetId,
      });
      setSuggestions((prev) => prev.filter((u) => u.user_id !== targetId));
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          People You May Know
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : suggestions.length === 0 ? (
          <Typography color="text.secondary">You're connected with everyone </Typography>
        ) : (
          <List>
            {suggestions.map((user) => (
              <ListItem key={user.user_id} secondaryAction={
                <Button variant="contained" size="small" onClick={() => handleConnect(user.user_id)}>
                  Follow
                </Button>
              }>
                <ListItemAvatar>
                  <Avatar src={user.profile_url} />
                </ListItemAvatar>
                <ListItemText primary={user.user_name} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Suggestions;
