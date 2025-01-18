import axios from 'axios'; //send HTTP requests
// import comment from '../../server/src/models/commentModel';

const BASE_URL = 'http://localhost:5003/api';

/* Handling authentication */
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, credentials, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error: Server might be down or unreachable');
            throw new Error('Unable to connect to server. Please check if the server is running.');
        }
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/register`, userData);
        return response.data; // Success response from the backend
    } catch (err) {
        // Return a meaningful error message from the server response
        if (err.response) {
            // Backend error (validation or other issues)
            throw new Error(err.response.data.message || 'Registration failed');
        } else {
            // Network or other issues
            throw new Error('Network error. Please try again later.');
        }
    }
};

/* For Community Module */
export const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      console.log("this is the token " + token);
      const response = await fetch(`${BASE_URL}/communityPost/fetch-all-post`, {
        method: "GET",
        headers: {
          Authorization: 'Bearer ' + token, // Include token in headers
          'Content-Type': 'application/json'
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Raw response data:", data); // Debug raw response
    return data.posts;
} catch (error) {
    console.error("Error fetching posts:", error);
    return [];
}
};

export const fetchUserAndFollowedPosts = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/communityPost/fetch-userfeed/${userId}`, {
      method: "GET",
      headers: {
        Authorization: 'Bearer ' + token, // Include token in headers
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchUserPosts = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/communityPost/fetch-userpost/${userId}`, {
      method: "GET",
      headers: {
        Authorization: 'Bearer ' + token, // Include token in headers
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data.posts; // Return the posts array
  } catch (error) {
    console.error("Error fetching posts:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchTargetPost = async (postId) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const response = await fetch(`${BASE_URL}/communityPost/fetch-post/${postId}`, {
        method: "GET",
        headers: {
          Authorization: 'Bearer ' + token, // Include token in headers
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched post data:", data); // Debug raw response
      return data.post; // Return the fetched post object
    } catch (error) {
      console.error("Error fetching post:", error);
      return null; // Return null in case of error
    }
  };
  
  
  
  // Create a new post at community module
  export const createPost = async (postData) => {
    console.log("Payload being sent:", postData);
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/communityPost/create-post`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) {
            console.log(response);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const likePost = async (_id) => {
    try {
    const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/communityPost/like-post`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: _id }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to like the post");
      }
  
      const data = await response.json();
      console.log("Post liked successfully:", data);
      return data; // Handle response if needed
    } catch (err) {
      console.error("Error liking post:", err.message);
    }
  };

  export const unlikePost = async (_id) => {
    try {
        const token = localStorage.getItem("token");
          const response = await fetch(`${BASE_URL}/communityPost/unlike-post`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ _id: _id }),
          });
      
          if (!response.ok) {
            throw new Error("Failed to unlike the post");
          }

          return await response.json(); // Handle response if needed
        } catch (err) {
          console.error("Error liking post:", err.message);
        }
  }
  
  // Controller to fetch comments for a post
  export const fetchPostComments = async (postId) => {
    try {
      const response = await axios.get(`${BASE_URL}/communityPost/fetch-comments/${postId}`);
      console.log ("fetch response: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // Controller to create a comment (including replies)
  export const createComment = async (data) => {
    console.log("Comment data:", data);
    try {
      const response = await axios.post(`${BASE_URL}/communityPost/post-comment`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error.response?.data || error.message);
      throw error;
    }
  };

  export const fetchCommentCount = async (postId) => {
    try {
      const response = await axios.get(`${BASE_URL}/communityPost/comments/count/${postId}`);
      return response.data.count;
    } catch (error) {
      console.error("Error fetching comment count:", error.response?.data || error.message);
      throw error;
    }
  };
  
  export const deletePost = async (postId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/communityPost/delete-post/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
      throw error;
    }
  };

  export const fetchCoordinators = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/communityPost/fetch-coordinators`);
      return response.data;
    } catch (error) {
      console.error("Error fetching coordinators:", error.response?.data || error.message);
      throw error;
    }
  };

  export const followUser = async (userId, followerId, followedIds) => {
    try {
      if (followedIds.includes(followerId)) {
        console.log("User is already followed");
        return { message: "User is already followed" };
      }
  
      console.log("userId: ", userId);
      console.log("followerId: ", followerId);
      const response = await axios.post(`${BASE_URL}/users/${userId}/follow`, { followerId });
      return response.data;
    } catch (error) {
      console.error("Error following user:", error.response?.data || error.message);
      throw error;
    }
  };
  
  export const unfollowUser = async (userId, followerId) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/${userId}/unfollow`, { followerId });
      return response.data;
    } catch (error) {
      console.error("Error unfollowing user:", error.response?.data || error.message);
      throw error;
    }
  };

export const fetchFollowedIds = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data.following.map(followedUser => followedUser._id);
  } catch (error) {
    console.error("Error fetching followed users:", error.response?.data || error.message);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  console.log("Payload being sent:", eventData);
  try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/communityPost/create-event`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
      });
      if (!response.ok) {
          console.log(response);
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  } catch (error) {
      console.error("Error creating post:", error);
      throw error;
  }
};

export const fetchEvents = async () => {
  try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/communityPost/fetch-events`, {
        method: "GET",
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
  }
};

export const fetchCoordinatorEvents = async () => {
  try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/communityPost/fetch-coordinator-events`, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
          },
      });
      console.log(response);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  } catch (error) {
      console.error("Error fetching coordinator events:", error);
      throw error;
  }
};

export const addPet = async (petData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Debug log before sending
        console.log('Sending pet data:', {
            hasPhoto: petData.get('photo') !== null,
            fields: Array.from(petData.entries()).map(([key, value]) => 
                key === 'photo' ? `${key}: ${value.name}` : `${key}: ${value}`
            )
        });

        const response = await axios.post(`${BASE_URL}/pets`, petData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // Important: Don't set Content-Type here, let axios set it for FormData
            },
            withCredentials: true,
            // Add timeout and validate status
            timeout: 30000,
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Don't reject if status is less than 500
            }
        });

        // Check response status
        if (response.status === 400) {
            throw new Error(response.data.error || 'Bad request');
        }

        if (response.status !== 201) {
            throw new Error('Failed to add pet');
        }

        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Add pet error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });

        // Throw specific error messages
        if (error.response?.status === 400) {
            throw new Error(error.response.data.error || 'Invalid pet data');
        }
        if (error.response?.status === 401) {
            throw new Error('Please login again');
        }
        throw new Error(error.message || 'Failed to add pet');
    }
};
