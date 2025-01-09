import React, { useEffect, useState } from 'react';
import "./Trending.css"
import { PostCard } from './PostCard';
import Logo from "../../assets/logo.png"
import ActiveCampaignCard from './ActiveCampaignCard';
import { fetchTrendingPosts, fetchPosts, fetchActiveCampaigns } from '../../api';
import TrendingPost from './TrendingPost';

const TrendingSection = () => {

    const [posts, setPosts] = useState([]);

    const getTrendingPosts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        let posts = [];
        posts = await fetchPosts(userId);
        // posts = await fetchTrendingPosts(userId); cause no correct format punya post
        console.log('Fetched trending posts:', posts);
        setPosts(posts || []);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      }
    };

    useEffect(() => {
    getTrendingPosts();
  }, []);


  const [campaigns, setCampaigns] = useState([]);

  const getActiveCampaigns = async () => {
    try {
      const data = await fetchActiveCampaigns();
      console.log('Fetched active campaigns:', data);
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching active campaigns:', error);
    }
  };

  useEffect(() => {
    getActiveCampaigns();
  }, []);


    return (
      <div className="TrendingSection">
          <div className="ActiveCampaigns">
          <div className='section-header'>
            <h3>Active Campaigns</h3>
            <p>Join the campaigns and share your thoughts!</p>
          </div>
          {campaigns.map((campaign, index) => (
          <ActiveCampaignCard key={index} campaign={campaign} />
        ))}
        </div>
        <div className="TrendingPosts">
          <div className='section-header'>
          <h3>Trending Posts</h3>
          <p>See what is on trend now and find your paw-friends!</p>
          </div>
          <div className="trending-posts">
            {posts.map((post, index) => (
            <TrendingPost key={index} imageSrc={post.photo} post={post} />
          ))}
          </div>
       
        </div>
      </div>
    );
  };
  
  export default TrendingSection;
  