import PostSkeleton from "../PostSkeleton/PostSkeleton";


export default function FeedSkeleton() {
  return (
    <section className="feed max-w-2xl mx-auto mt-8 px-4 sm:px-6 lg:px-0 mb-12">
      {/* Header skeleton */}
      <header className="mb-8 relative">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl blur-xl"></div>
        <div className="relative space-y-3">
          <div className="h-8 w-48 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-64 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </header>

      {/* Post skeletons */}
      <div className="space-y-6">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    </section>
  );
}


