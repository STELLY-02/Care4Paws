import React, { useState, useEffect } from 'react';
import './CoordinatorFeed.css';
import {
  LivestreamPlayer,
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  useCallStateHooks,
  ParticipantView,
  useCall,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { createCampaigns, fetchUserPosts } from '../../api';
import Logo from '../../assets/Logo-fit.png';
import PostCreationModal from './PostCreationModal';
import { PostCard } from "../CommunityComponent/PostCard";
import CuteDog from "../../assets/dogwlove.png"
import { FaPeopleGroup } from "react-icons/fa6";
import { MdCampaign } from "react-icons/md";
import { IoIosBookmarks } from "react-icons/io";
import CuteDog2 from "../../assets/cutedog2.png"


const apiKey = "qy27ve6mpk4e"; // Replace with your Stream API key
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJAc3RyZWFtLWlvL2Rhc2hib2FyZCIsImlhdCI6MTczNjI0NTE5MywiZXhwIjoxNzM2MzMxNTkzLCJ1c2VyX2lkIjoiIWFub24iLCJyb2xlIjoidmlld2VyIiwiY2FsbF9jaWRzIjpbImxpdmVzdHJlYW06bGl2ZXN0cmVhbF8yYTU2OWY4Zi1hMjZjLTRlNWMtYjBjZC03NzNjMzUwZWJlODciXX0.EUhnkoexEQwdv-IpFy7m2MJFjrr01N5qjpirr6sk32k"; // Replace with your Stream token
const callId = "livestream_2a569f8f-a26c-4e5c-b0cd-773c350ebe87"; // Replace with your call ID

const userId = localStorage.getItem("userId");

const user = { id: userId };
const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('livestream', callId);

const MyLivestreamUI = () => {
  const { useIsCallLive, useLocalParticipant, useParticipantCount } = useCallStateHooks();
  const totalParticipants = useParticipantCount();
  const localParticipant = useLocalParticipant();
  const isCallLive = useIsCallLive();
  const call = useCall();

  return (
    <div className='big-div'>
      <div className='participants-box'>
        Live: {totalParticipants}
      </div>
      <div className='video-box'>
        {localParticipant && (
          <ParticipantView 
            participant={localParticipant}
            ParticipantViewUI={null}
          />
        )}
      </div>
      <div className='go-live'>
        {isCallLive ? (
          <button onClick={() => call?.stopLive()}>Stop Live</button>
        ) : (
          <button onClick={() => call?.startLive()}>Start Live</button>
        )}
      </div>
      <div id="live-stream">
        <LivestreamPlayer callType="livestream" callId={callId} />
      </div>
    </div>
  );
};

function CoordinatorFeed() {
  //campaign 
  const [isCampaignsOpen, setIsCampaignsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Prepare data to be sent
    const campaignData = {
      title,
      description,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated.");
      }

      const response = await createCampaigns(campaignData);
        setIsCampaignsOpen(false); 

        setTitle('');  
        setDescription(''); 
    } catch (error) {
      console.error("Error submitting campaign:", error);
    }
  }

  const handleCampaignsModal = () => {
    setIsCampaignsOpen(!isCampaignsOpen);
  };


  //posting
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ text:"", image: null });

  const handleAddPost = () => {
    setIsPostOpen(true);
  };

  const handleCloseModal = () => {
    setIsPostOpen(false);
  };

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, text: e.target.value });
  };

  const handleImageUpload = async (file) => {
    console.log("handleImageUpload called");
    console.log("Selected file:", file);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8085/api/uploadPic/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Image uploaded:", response.data);
      return response.data.data; // Cloudinary URL
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeletePost = () => {
    console.log("Deleting post with ID:");
  };

  const handlePostSubmit = async (e) => {
          e.preventDefault();
          try {
            let imageUrl = newPost.image;
            const newPostData = {
              caption: newPost.text,
              photo: imageUrl,
            };
    
            console.log("Submitting post data:", newPostData);
        
            await createPost(newPostData);
            const updatedPosts = await fetchUserPosts(campaign.title);
            setPosts(updatedPosts);
        
            setNewPost({ text: "", image: null });
            if (fileInputRef.current) {
              fileInputRef.current.value = ""; // Reset the file input
          }
          } catch (error) {
            console.error("Error submitting post:", error);
          }
        };

  //feed & comment 
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
        try {
          const userId = localStorage.getItem("userId");
          const role = localStorage.getItem("role");
          console.log("current role: ", role);
          console.log("Fetching posts for user ID:", userId);
          let posts = [];
          posts = await fetchUserPosts(userId);
          
          console.log("Fetched posts:", posts);
          setPosts(posts || []);
        } catch (error) {
          console.error("Failed to load posts:", error);
          setPosts([]);
        }
      };
  
      useEffect(() => {
        loadPosts();
    }, []);

    const openCommentModal = (postId, updateCommentCount) => {
      const selected = posts.find((post) => post._id === postId);
      console.log("Selected post:", selected);
      setSelectedPost(selected);
      setIsCommentOpen(true);
      setModalData({ updateCommentCount });
    };
  
    const closeCommentModal = () => {
      setSelectedPost(null);
      setIsCommentOpen(false);
    };

    useEffect(() => {
      // When selectedPost changes, open the modal after the state is updated
      if (selectedPost) {
        setIsCommentOpen(true);
      }
    }, [selectedPost]);

  //live
  const [isLive, setIsLive] = useState(false);
  const handleLiveButtonClick = () => {
    setIsLive(true);
    call.join({ create: true }).catch((e) => {
      console.error("Failed to join call", e);
    });
    // Notify followers about the live streaming
    // This can be done via an API call to notify followers
  };

  useEffect(() => {
    return () => {
      call.leave().catch((e) => {
        console.error("Failed to leave call", e);
      });
    };
  }, []);

  return (
    <div>
      <div className='coordinator-header'>
        <img src={CuteDog} alt="" className="cute-dog" />
        <h1>Welcome back, fur-tastic friend ! Let's see what's paw-pular today</h1>
      </div>
      <div className="coordinator-feed-left">
        <div className='coordinator-intro'>
        <img src={CuteDog2} alt="" className="cute-dog2" />
        <h3>Caught a new vibe? Let's do pawsome things today! </h3>
        </div>
        <div className="coordinator-functions">
          <div className="functionbox">
          <FaPeopleGroup 
            size={40}
            color="493628"/>
            <p>Feeling like connect with your community? Go live now!</p>
          <button onClick={handleLiveButtonClick}>Go Live</button>
            {isLive && (
              <StreamVideo client={client}>
                <StreamCall call={call}>
                  <MyLivestreamUI />
                </StreamCall>
              </StreamVideo>
              )}
          </div>
          <div className="functionbox">
          <MdCampaign 
            size={45}
            color="493628"/>
          <p>Any idea to help the pet community? Initiate a campaign now!</p>
          <button onClick={handleCampaignsModal}>Initiate Campaign</button>
            <div id="campaigns">
          {isCampaignsOpen && (
          <div className="modal" onClick={handleCampaignsModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} >
            <img src={Logo} alt="" className="logo-active" />
              <h2 className='campaigns-form'>Create Campaign</h2>
              <form onSubmit={handleFormSubmit}>
                <label>
                  Campaign Title:
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                  className='campaign-desc'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </label>
                <button type="submit">Submit</button>
                <button type="button" onClick={handleCampaignsModal}>
                  Close
                </button>
              </form>
            </div>
          </div>
        )}
        </div>
          </div>   
      <div className="functionbox">
        <IoIosBookmarks 
          size={35}
          color="493628"/>
          <p>Every paw has a story. Share yours and connect today!</p>
          <button onClick={handleAddPost}>Create Post</button>
          <div id="create-post">
              <PostCreationModal
              isOpen={isPostOpen}
              onClose={handleCloseModal}
              campaignTitle=""
              handlePostSubmit={handlePostSubmit}
              newPost={newPost}
              handlePostChange={handlePostChange}
              handleImageUpload={handleImageUpload}
            />
          </div>
          </div>
        </div>
      </div>
      <div className='coordinator-feed-right'>
      <h3>Sniff around—there’s always something new to discover!  </h3>
      <div className="FeedPosts">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <PostCard
            key={index}
            _id={post._id}
            postedBy={post.postedBy}
            avatarSrc={post.avatarSrc}
            username={post.username}
            imageSrc={post.photo}
            description={post.caption}
            timestamp={post.timestamp}
            date={post.date}
            likes={post.likes}
            comments={post.comments}
            userLikes={post.userLikes}
            openModal={() => openCommentModal(post._id)}
            onDelete={handleDeletePost}
          />
        ))
      ) : (
        <p>No posts to display.</p>)}
        </div>
        {isCommentOpen && selectedPost && (
          <CommentModal post={selectedPost} onClose={closeCommentModal} updateCommentCount={modalData} />
        )}
      </div>
    </div>
  );
}

export default CoordinatorFeed;