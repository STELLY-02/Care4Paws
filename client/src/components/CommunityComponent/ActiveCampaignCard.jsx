import React, { useState, useRef } from 'react';
import PostCreationModal from './PostCreationModal';
import './ActiveCampaignCard.css';
import { createPost, fetchPostsByTitle } from '../../api';
import Logo from '../../assets/Logo-fit.png';
import PostModal from './PostModal';

const ActiveCampaignCard = ({ campaign }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ text: campaign.title, image: null });
  const fileInputRef = useRef(null);

  const handleAddPost = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, text: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        setNewPost({ ...newPost, image: reader.result }); // Base64-encoded string
    };

    reader.onerror = (error) => {
        console.error("Error reading image file:", error);
    };

    reader.readAsDataURL(file); // Converts to Base64
};

const handleDeletePost = () => {
  console.log("Deleting post with ID:");
};

  const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
          const newPostData = {
            caption: newPost.text,
            photo: newPost.image,
          };
  
          console.log("Submitting post data:", newPostData);
      
          await createPost(newPostData);
          const updatedPosts = await fetchPostsByTitle(campaign.title);
          setPosts(updatedPosts);
      
          setNewPost({ text: "", image: null });
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input
        }
        } catch (error) {
          console.error("Error submitting post:", error);
        }
      };

      const handleViewPosts = async () => {
        try {
          console.log("Fetching posts with the same caption:", campaign.title);
          const posts = await fetchPostsByTitle(campaign.title);
          console.log("Fetched posts with the same caption:", posts);
          setPosts(posts);
          setIsPostModalOpen(true);
        } catch (error) {
          console.error("Error fetching posts by caption:", error);
        }
      };

      const handleClosePostModal = () => {
        setIsPostModalOpen(false);
      };

  return (
    <div className="active-campaign-card">
      <img src={Logo} alt="" className="logo-active" />
      <h2>{campaign.title}</h2>
      <p>{campaign.description}</p>
      <div className='button-alignment'>
        <button onClick={handleAddPost}>Add Post</button>
        <button onClick={handleViewPosts}>View Posts</button>
      </div>
      <PostCreationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        campaignTitle={campaign.title}
        handlePostSubmit={handlePostSubmit}
        newPost={newPost}
        handlePostChange={handlePostChange}
        handleImageUpload={handleImageUpload}
      />
      <PostModal
        isOpen={isPostModalOpen}
        onClose={handleClosePostModal}
        posts={posts}
        handleDeletePost={handleDeletePost}
      />
      {/* <div className="posts-container">
      {posts.map((post, index) => (
          <PostCard
          key={index}
          _id={post._id}
          avatarSrc={post.postedBy.avatarSrc}
          username={post.postedBy.username}
          displayName={post.postedBy.displayName}
          imageSrc={post.photo}
          description={post.caption}
          timestamp={post.createdAt}
          date={post.createdAt}
          likes={post.likes}
          userLikes={post.userLikes}
          onDelete={handleDeletePost}
          comments={post.comments}
          />
        ))}
      </div> */}
    </div>
  );
};

export default ActiveCampaignCard;




// const ActiveCampaign = ({ title, description, postsCount, onViewPosts, onAddPost }) => {
//   return (
//     <div className="ActiveCampaign">
//       <h3>{title}</h3>
//       <p>{description}</p>
//       <div className="campaign-stats">
//         <p><strong>{postsCount}</strong> people have joined this campaign!</p>
//       </div>
//       <div className="campaign-buttons">
//         <button onClick={onViewPosts}>View Posts</button>
//         <button onClick={onAddPost}>Add Yours</button>
//       </div>
//     </div>
//   );
// };

// const ActiveCampaignCard = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCampaign, setSelectedCampaign] = useState(null);

//   const handleViewPosts = (campaign) => {
//     setSelectedCampaign(campaign);
//     setIsModalOpen(true);
//   };

//   const handleAddPost = () => {
//     console.log("Prompt user to add a new post!");
//   };

//   const campaigns = [
//     {
//       title: "Adopt a Friend Month",
//       description: "Encouraging pet adoptions and fostering this month!",
//       postsCount: 120,
//     },
//     {
//         title: "Adopt a Friend Month",
//         description: "Encouraging pet adoptions and fostering this month!",
//         postsCount: 120,
//       },
//   ];

//   return (
//     <>
//       <div className="ActiveCampaigns">
//         {campaigns.map((campaign, index) => (
//           <ActiveCampaign
//             key={index}
//             title={campaign.title}
//             description={campaign.description}
//             postsCount={campaign.postsCount}
//             onViewPosts={() => handleViewPosts(campaign)}
//             onAddPost={handleAddPost}
//           />
//         ))}
//       </div>

//       {isModalOpen && selectedCampaign && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>{selectedCampaign.title} - Posts</h2>
//             <p>List of posts for the campaign...</p>
//             <button onClick={() => setIsModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}
//       </>
//   );
// };

// export default ActiveCampaignCard;
