import PostSkeleton from "../posts/PostSkeleton";


export default function FeedSkeleton() {
  return (
    <section className="mt-5 mb-10">
      {/* Tab skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
        <div className="flex">
          <div className="flex-1 py-3.5 flex justify-center">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex-1 py-3.5 flex justify-center">
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Post skeletons */}
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    </section>
  );
}


