import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PostsContext } from "../../context/PostProvider";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import { usePostComments } from "../../hooks/usePostComments";
import { usePostLikes } from "../../hooks/usePostLikes";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostStats from "./PostStats";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import LikesModal from "./LikesModal";
import ShareModal from "./ShareModal";

/**
 * PostDetails Component
 * Main container for displaying a complete post
 * 
 * Refactored to use:
 * - Custom hooks for state management
 * - Component composition for UI
 * - Clean separation of concerns
 */
export default function PostDetails({
  body,
  image,
  name,
  username,
  photo,
  date,
  id,
  userId,
  onCommentCreated,
  likes = [],
  likesCount: initialLikesCount = 0,
  commentsCount: initialCommentsCount = 0,
  sharesCount = 0,
  topComment = null,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  isShare = false,
  sharedPost = null,
  privacy = "public",
  comments,
  commentsLimit = 1,
}) {
  const { user } = useContext(AuthContext);
  const postsContext = useContext(PostsContext);
  const deletePost = postsContext?.deletePost;

  // Custom hooks for state management
  const {
    isLiked,
    likesCount,
    handleLike,
    isBookmarked,
    handleBookmark,
    showShareModal,
    shareMessage,
    shareLoading,
    setShareMessage,
    openShareModal,
    closeShareModal,
    handleShareSubmit,
  } = usePostInteractions(id, initialIsLiked, initialLikesCount || likes?.length || 0, initialIsBookmarked);

  const {
    commentsCount,
    topCommentState,
    commentsExpanded,
    fullComments,
    loadingComments,
    expandComments,
    updateComments,
  } = usePostComments(id, comments, initialCommentsCount, topComment);

  const {
    showLikesModal,
    likersList,
    likersHasMore,
    likersLoading,
    openLikesModal,
    loadMoreLikers,
    closeLikesModal,
  } = usePostLikes(id, likesCount);

  // Derived values
  const isOwner = userId && user && (userId === user._id || userId === user.id);
  const displayName = username || name?.toLowerCase().replace(/\s+/g, "");

  // Handlers
  const handleDelete = () => {
    if (deletePost) deletePost(id);
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible hover:shadow-md transition-shadow duration-300">
      {/* Header - User info and menu */}
      <PostHeader
        name={name}
        username={username}
        photo={photo}
        date={date}
        postId={id}
        userId={userId}
        privacy={privacy}
        isOwner={isOwner}
        isBookmarked={isBookmarked}
        onBookmark={handleBookmark}
        onDelete={handleDelete}
      />

      {/* Content - Body, image, shared post */}
      <PostContent body={body} image={image} isShare={isShare} sharedPost={sharedPost} />

      {/* Stats - Likes, shares, comments count */}
      <PostStats
        likesCount={likesCount}
        sharesCount={sharesCount}
        commentsCount={commentsCount}
        onLikesClick={openLikesModal}
        onCommentsClick={expandComments}
      />

      {/* Action Buttons - Like, Comment, Share */}
      <PostActions
        isLiked={isLiked}
        commentsExpanded={commentsExpanded}
        onLike={handleLike}
        onComment={expandComments}
        onShare={openShareModal}
      />

      {/* Comments Section - Collapsed or expanded */}
      <PostComments
        postId={id}
        commentsExpanded={commentsExpanded}
        topCommentState={topCommentState}
        commentsCount={commentsCount}
        fullComments={fullComments}
        loadingComments={loadingComments}
        onExpandComments={expandComments}
        onCommentCreated={onCommentCreated}
        updateComments={updateComments}
      />

      {/* Likes Modal */}
      <LikesModal
        isOpen={showLikesModal}
        likersList={likersList}
        likersHasMore={likersHasMore}
        likersLoading={likersLoading}
        onClose={closeLikesModal}
        onLoadMore={loadMoreLikers}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        shareMessage={shareMessage}
        shareLoading={shareLoading}
        postData={{ name, username, photo, body, image, displayName }}
        onMessageChange={setShareMessage}
        onSubmit={handleShareSubmit}
        onClose={closeShareModal}
      />
    </article>
  );
}
