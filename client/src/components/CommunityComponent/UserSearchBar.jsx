import React, { useState } from 'react';
import { searchUsers } from "../../api"
import { useNavigate } from 'react-router-dom';
import "./UserSearchBar.css"

const UserSearchBar = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) {
      return; // Avoid empty searches
    }

    setLoading(true);
    try {
      const matchedUsers = await searchUsers(query);
      setUsers(matchedUsers);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  const handleClear = () => {
    setQuery('');
    setUsers([]);
  };

  return (
    <div>
      <div className='search-bar-user'>
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={handleClear} disabled={!query && !users.length}>
        Clear
        </button>
      </div>
      
      {users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li className="user-list" key={user._id} onClick={() => handleViewProfile(user._id)}>
              {user.username}
            </li>
          ))}
        </ul>
      )}

      {/* {users.length === 0 && !loading && query && (
        <p>No users found for "{query}".</p>
      )} */}
    </div>
  );
};

export default UserSearchBar;
