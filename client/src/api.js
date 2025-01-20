import axios from 'axios'; //send HTTP requests
// import comment from '../../server/src/models/commentModel';

const BASE_URL = 'http://localhost:8085/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
      'Content-Type': 'application/json'
  }
});

/* Handling authentication */
export const loginUser = async (credentials) => {
    try {
        //axios.post needs URL and data (an object)
        const { data } = await axios.post(`${BASE_URL}/auth/login`, credentials);
        console.log("here is", data);
        return data; // { token, role }
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error; // Ensure errors are propagated to the caller
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

export const editProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${BASE_URL}/auth/edit-profile`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Network error. Please try again.");
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
        Authorization: 'Bearer ' + token,
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

export const fetchTrendingPosts = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/communityPost/fetch-trendingpost/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    throw error;
  }
};

export const fetchPostsByTitle = async (caption) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/communityPost/fetch-posts-by-title?title=${encodeURIComponent(caption)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching posts by title:', error);
    throw error;
  }
};

export const fetchActiveCampaigns = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/communityPost/fetch-activecampaigns`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("api, active campaigns: ", response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching active campaigns:', error);
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

  export const searchUsers = async (username) => {
    try {
      const response = await axios.get(`${BASE_URL}/communityPost/search-users`, {
        params: { username },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error.response?.data || error.message);
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
      console.log("response from api: ", response);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  } catch (error) {
      console.error("Error fetching coordinator events:", error);
      throw error;
  }
};

export const fetchParticipantsList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/communityPost/participants`);
    return response.data;
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
};

export const acceptParticipant = async (participantId) => {
  try {
    const response = await axios.post(`${BASE_URL}/communityPost/participants/accept/${participantId}`);
    return response.data;
  } catch (error) {
    console.error('Error accepting participant:', error);
    throw error;
  }
};

export const registerParticipants = async (participantData) => {
  try {
    const response = await axios.post(`${BASE_URL}/communityPost/participants/register`, participantData);
    return response.data;
  } catch (error) {
    console.error('Error registering participants:', error);
    throw error;
  }
};

export const createCampaigns = async (campaignsData) => {
  console.log("Payload being sent:", campaignsData);
  try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/communityPost/create-campaigns`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(campaignsData),
      });

      console.log("Response status:", response.status);
      console.log("Response body:", await response.text());

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

      const response = await axios.post(`${BASE_URL}/pets`, petData, {  ///check if api here needed at backend
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

// Submit adoption form
export const submitAdoptForm = async (petId, formData) => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          throw new Error('No authentication token found');
      }

      console.log('Submitting adoption form:', {
          petId,
          formData
      });

      const response = await api.post(`/adopt/${petId}/submit`, formData, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      return response.data;
  } catch (error) {
      console.error('Submit adoption form error:', {
          message: error.message,
          response: error.response?.data
      });

      if (error.response?.status === 400) {
          throw new Error(error.response.data.error || 'Invalid form data');
      }
      if (error.response?.status === 401) {
          throw new Error('Please login to submit adoption form');
      }
      throw new Error(error.message || 'Failed to submit adoption form');
  }
};

// Update adoption status (for coordinator)
export const updateAdoptionStatus = async (requestId, status) => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          throw new Error('No authentication token found');
      }

      console.log('Updating adoption status:', {
          requestId,
          status
      });

      const response = await api.patch(`/adopt/${requestId}/status`, 
          { status },
          {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          }
      );

      return response.data;
  } catch (error) {
      console.error('Update adoption status error:', {
          message: error.message,
          response: error.response?.data
      });

      if (error.response?.status === 400) {
          throw new Error(error.response.data.error || 'Invalid status');
      }
      if (error.response?.status === 401) {
          throw new Error('Please login to update adoption status');
      }
      throw new Error(error.message || 'Failed to update adoption status');
  }
};

// Get adoption requests (for coordinator)
export const getAdoptionRequests = async () => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          throw new Error('No authentication token found');
      }

      const response = await api.get('/adopt', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      return response.data;
  } catch (error) {
      console.error('Get adoption requests error:', {
          message: error.message,
          response: error.response?.data
      });

      if (error.response?.status === 401) {
          throw new Error('Please login to view adoption requests');
      }
      throw new Error(error.message || 'Failed to fetch adoption requests');
  }
};

export const createEducationPost = async (postData, token) => {
  try {
    const response = await axios.post(
      "http://localhost:8085/api/educationPost/create",
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the JWT token for authentication
        },
      }
    );
    return response.data; // Response from backend (post data or success message)
  } catch (error) {
    console.error(
      "Error creating education post:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create education post"
    );
  }
};

export const getEducationPosts = async (token) => {
  try {
    const response = await axios.get(
      "http://localhost:8085/api/educationPost/educationContent", // Adjust URL if necessary
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the JWT token for authentication
        },
      }
    );
    return response.data.posts; // Return only the posts array from the response
  } catch (error) {
    console.error(
      "Error fetching education posts:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch education posts");
  }
};

export const getEducationPostById = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8085/api/educationPost/educationPost/${id}`
    ); // Fetch post by ID
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    const data = await response.json(); // Get the post data
    return data; // Return the post data
  } catch (error) {
    console.error("Error fetching post:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const deleteEducationPost = async (postId, token) => {
  try {
    const response = await axios.delete(
      `http://localhost:8085/api/educationPost/delete/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the JWT token for authentication
        },
      }
    );

    // Ensure the response is successful
    if (response.status !== 200) {
      throw new Error("Failed to delete post"); // Or a more specific error based on response status
    }

    return response.data; // Success response from backend
  } catch (error) {
    console.error(
      "Error deleting education post:",
      error.response?.data || error.message
    );
    throw new Error("Failed to delete education post");
  }
};

export const createCoordinator = async (formData, token) => {
  try {
    const response = await axios.post(
      "http://localhost:8085/api/coordinatorDonation/donateDetailsC",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
        },
      }
    );
    return response.data; // Success response from the backend
  } catch (error) {
    console.error(
      "Error creating coordinator:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create coordinator"
    );
  }
};

export const donateUser = async (donationData, token) => {
  try {
    const response = await axios.post(
      "http://localhost:8085/api/donation/donateUser",
      donationData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to create user donation.");
    }

    return response.data; // Success response from backend
  } catch (error) {
    console.error(
      "Error creating user donation:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create user donation"
    );
  }
};

export const fetchEduCoordinators = async (token) => {
  try {
    const response = await axios.get(
      "http://localhost:8085/api/coordinatorDonation/all",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch coordinators.");
    }

    return response.data.coordinators; // Return the coordinators array
  } catch (error) {
    console.error(
      "Error fetching coordinators:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch coordinators"
    );
  }
};

export const fetchDonationHistory = async (token) => {
  try {
    const response = await axios.get(
      "http://localhost:8085/api/donation/donationHistory",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Success response from backend
  } catch (error) {
    console.error(
      "Error fetching donation history:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch donation history"
    );
  }
};

export const fetchCoordinatorDonationHistory = async (token) => {
  try {
    const response = await axios.get(
      "http://localhost:8085/api/donation/coordinatorHistory",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return donations data
  } catch (error) {
    console.error(
      "Error fetching coordinator donation history:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch coordinator donation history"
    );
  }
};

export const fetchCoordinatorDetails = async (token) => {
  try {
    const response = await axios.get(
      "http://localhost:8085/api/coordinatorDonation/Cdetails",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.coordinator; // Return the coordinator details
  } catch (error) {
    console.error(
      "Error fetching coordinator details:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch coordinator details"
    );
  }
};

export const reportPet = async (formData, token) => {
  console.log("Form data entries:", Array.from(formData.entries()));
  console.log("Sending pet data:", {
    hasPhoto: formData.get("photo") !== null, // Check if a photo exists
    fields: Array.from(formData.entries()).map(([key, value]) =>
      key === "photo" ? `${key}: ${value.name}` : `${key}: ${value}`
    ),
  });
  try {
    // Sending formData as the request body and authorization header
    const response = await axios.post(
      "http://localhost:8081/api/PetReport",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      }
    );

    // Return the server response data
    return response.data;
  } catch (error) {
    console.error("Error while reporting pet:", error); // Log the specific error
    throw new Error(error.message || "Failed to report pet. Please try again.");
  }
};

// Example API function to fetch user posts
export const getUserPosts = async (token) => {
  try {
    const response = await fetch("/api/PetReports", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include", // Include if you're using cookies
    });

    if (!response.ok) {
      // Parse error details from the server if available
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch posts");
    }

    // Parse the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw error;
  }
};

// Fetch user-specific lost pet reports
export const getUserReports = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/reports/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; // Return the data from the response (user's lost reports)
  } catch (error) {
    console.error("Error fetching user reports:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch user reports."
    );
  }
};

// Mark a lost pet report as found (also deletes the report)
export const markLostAsFound = async (reportId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/reports/${reportId}/found`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return the server response
  } catch (error) {
    console.error("Error marking report as found:", error);
    throw new Error(
      error.response?.data?.message || "Failed to mark report as found."
    );
  }
};

// Match lost pets with found pets
export const getMatches = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/matchPets`);
    return response.data.matches; // This will contain the matched pets
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

// Send notifications to pet owners for matches
export const sendNotificationToOwner = async (matchData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/sendNotification`,
      matchData, // matchData is already the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Set content type explicitly
        },
      }
    );

    // Check for successful response
    if (response.status !== 200) {
      throw new Error(
        `Failed to send notification. Status: ${response.status}`
      );
    }

    return response.data; // Assuming the response data contains useful information
  } catch (error) {
    console.error("Notification error:", error.message); // Log error for debugging
    throw error;
  }
};