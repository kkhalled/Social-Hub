import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useParams, useNavigate, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faPaperPlane,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faShareFromSquare,
  faHeart,
  faThumbsUp as likebtn,
} from "@fortawesome/free-regular-svg-icons";
import CommentCard from "../../components/CommentCard/CommentCard";
import PostSkeleton from "../../components/PostSkeleton/PostSkeleton";
import PostDetails from "../../components/PostDetails/PostDetails";
import EditPost from "../../components/EditPost/EditPost";

export default function Post() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if edit mode is active from query parameter
  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get("edit") === "true";

  async function getSinglePost() {
    try {
      const options = {
        url: `/posts/${id}`,
        method: "GET",
      };

      const { data } = await axiosInstance.request(options);
      console.log(data);
      if (data.message === "success") {
        setPost(data.post);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Handle new comment - add it optimistically and then refresh
  function handleCommentCreated(newComment) {
    if (newComment && post) {
      // Optimistically add the comment immediately
      setPost(prevPost => ({
        prevPost,
        comments: [(prevPost.comments || []), newComment]
      }));
    }
    // Then refresh from server to ensure we have the latest data
    getSinglePost();
  }

  useEffect(() => {
    getSinglePost();
  }, []);

  return (
    <div className="min-h-screen  bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors group"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span>Back to Feed</span>
        </button>
        {!post ? (
          <PostSkeleton />
        ) : isEditMode ? (
          <EditPost post={post} userPhoto={post.user.photo} userName={post.user.name} />
        ) : (
          <PostDetails 
            body={post.body} 
            image={post.image} 
            name={post.user.name} 
            photo={post.user.photo} 
            date={post.createdAt} 
            comments={post.comments}  
            commentsLimit={10}
            id={post._id || post.id}
            userId={post.user._id || post.user.id}
            onCommentCreated={handleCommentCreated}
            userPhoto={post.user.photo}
            userName={post.user.name}
          />
        )}
      </div>
    </div>
  );
}
