import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { useUser } from "../Contexts/ContextProvider";

import {
  Avatar,
  Box,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import Suggestions from "../Suggestions/Suggestions";

const Network = () => {
  const { userId } = useUser();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [tab, setTab] = useState(0);

  const fetchNetwork = async () => {
    try {
      const [resFollowers, resFollowing] = await Promise.all([
        axios.get(`http://localhost:5000/api/followers/${userId}`),
        axios.get(`http://localhost:5000/api/following/${userId}`),
      ]);
      setFollowers(resFollowers.data);
      setFollowing(resFollowing.data);
    } catch (err) {
      console.error("Failed to fetch network data", err);
    }
  };

  useEffect(() => {
    if (userId) fetchNetwork();
  }, [userId]);

  const handleRemoveFollower = async (followerId) => {
    try {
      await axios.post("http://localhost:5000/api/remove-follower", {
        follower_id: followerId,
        user_id: userId,
      });
      setFollowers((prev) => prev.filter((f) => f.user_id !== followerId));
    } catch (err) {
      console.error("Failed to remove follower", err);
    }
  };

  const handleUnfollow = async (followingId) => {
    try {
      await axios.post("http://localhost:5000/api/unfollow", {
        follower_id: userId,
        following_id: followingId,
      });
      setFollowing((prev) => prev.filter((f) => f.user_id !== followingId));
    } catch (err) {
      console.error("Failed to unfollow", err);
    }
  };

  const currentList = tab === 0 ? followers : following;

  return (
    <div>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3}>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Followers" />
            <Tab label="Following" />
          </Tabs>

          {currentList.length === 0 ? (
            <Typography sx={{ p: 3, textAlign: "center", color: "gray" }}>
              No {tab === 0 ? "followers" : "following"} found.
            </Typography>
          ) : (
            <List>
              {currentList.map((user) => (
                <ListItem
                  key={user.user_id}
                  secondaryAction={
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() =>
                        tab === 0
                          ? handleRemoveFollower(user.user_id)
                          : handleUnfollow(user.user_id)
                      }
                    >
                      {tab==1?"Unfollow":"Remove"}
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={user.avatar || "https://via.placeholder.com/150"}
                      alt={user.user_name}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={user.user_name} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
      <Suggestions />
    </div>
  );
};

export default Network;
