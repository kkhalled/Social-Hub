import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { getFollowSuggestions, toggleFollowUser } from "../../api/usersApi";
import defaultAvatar from "../../assets/user.png";
import { toast } from "react-toastify";

export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingState, setFollowingState] = useState({});

  useEffect(() => {
    loadSuggestions();
  }, []);

  async function loadSuggestions() {
    try {
      setLoading(true);
      const response = await getFollowSuggestions(10);
      if (response.message === "success") {
        setSuggestions(response.users || []);
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFollow(userId) {
    try {
      setFollowingState(prev => ({ ...prev, [userId]: true }));
      const response = await toggleFollowUser(userId);
      if (response.message === "success") {
        toast.success("Followed");
        // Remove from suggestions after following
        setSuggestions(prev => prev.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow");
      setFollowingState(prev => ({ ...prev, [userId]: false }));
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4">
            Suggested For You
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
          Suggested For You
        </h3>

        <div className="space-y-4">
          {suggestions.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <Link to={`/user/${user._id}`}>
                <img
                  src={user.photo || defaultAvatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md group-hover:ring-blue-200 transition-all"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/user/${user._id}`}>
                  <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                    {user.name}
                  </h4>
                </Link>
                <p className="text-xs text-gray-500 truncate">
                  @{user.email?.split('@')[0] || 'user'}
                </p>
              </div>

              <button
                onClick={() => handleFollow(user._id)}
                disabled={followingState[user._id]}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all hover:shadow-lg disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                Follow
              </button>
            </div>
          ))}
        </div>

        {suggestions.length > 0 && (
          <Link
            to="/explore"
            className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-700 font-semibold"
          >
            See More
          </Link>
        )}
      </div>
    </div>
  );
}
