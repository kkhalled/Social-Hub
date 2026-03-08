import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserGroup, faSearch } from "@fortawesome/free-solid-svg-icons";
import { getFollowSuggestions, toggleFollowUser } from "../../api/usersApi";
import defaultAvatar from "../../assets/user.png";
import { toast } from "react-toastify";

export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingState, setFollowingState] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSuggestions();
  }, []);

  async function loadSuggestions() {
    try {
      setLoading(true);
      const response = await getFollowSuggestions(10);
      if (response.message === "success" || response.success === true) {
        setSuggestions(response.data?.suggestions || response.users || []);
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFollow(userId) {
    try {
      setFollowingState((prev) => ({ ...prev, [userId]: true }));
      const response = await toggleFollowUser(userId);
      if (response.message === "success") {
        toast.success("Followed!");
        setSuggestions((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow");
      setFollowingState((prev) => ({ ...prev, [userId]: false }));
    }
  }

  const filtered = searchQuery
    ? suggestions.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suggestions;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Suggested Friends</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1">
                <div className="h-3.5 bg-gray-200 rounded w-24 mb-1.5" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUserGroup} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Suggested Friends</h3>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {suggestions.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Suggestions List */}
      <div className="px-3 pb-3 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-hide">
        {filtered.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Link to={`/user/${user._id}`} className="shrink-0">
              <img
                src={user.photo || defaultAvatar}
                alt={user.name}
                onError={(e) => { e.target.src = defaultAvatar; }}
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link to={`/user/${user._id}`}>
                <h4 className="font-semibold text-gray-900 text-sm truncate hover:text-blue-600 transition-colors">
                  {user.name}
                </h4>
              </Link>
              <p className="text-xs text-gray-500 truncate">
                @{user.username || user.name?.toLowerCase().replace(/\s+/g, "")}
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[11px] text-gray-400">
                  {user.followersCount ?? 0} followers
                </span>
                {user.mutualFollowersCount > 0 && (
                  <span className="text-[11px] text-blue-500 font-medium">
                    {user.mutualFollowersCount} mutual
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleFollow(user._id)}
              disabled={followingState[user._id]}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-[10px]" />
              Follow
            </button>
          </div>
        ))}

        {filtered.length === 0 && searchQuery && (
          <p className="text-center text-gray-400 text-sm py-4">No matches found</p>
        )}
        {filtered.length === 0 && !searchQuery && (
          <p className="text-center text-gray-400 text-sm py-4">No suggestions right now</p>
        )}
      </div>
    </div>
  );
}
