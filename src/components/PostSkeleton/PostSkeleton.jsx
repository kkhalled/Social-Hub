import CommentSkeleton from "../CommentSkeleton/CommentSkeleton";

export default function PostSkeleton() {
  return (
    <article className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
      {/* Header skeleton */}
      <header className="flex justify-between items-center px-6 py-5 bg-linear-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3.5">
          {/* Avatar skeleton */}
          <div className="w-12 h-12 rounded-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
      </header>

      {/* Caption skeleton */}
      <div className="px-6 pb-4 space-y-2">
        <div className="h-4 w-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Image skeleton */}
      <div className="w-full h-80 bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>

      {/* Reactions skeleton */}
      <div className="flex justify-between items-center px-6 py-4 bg-linear-to-r from-gray-50/30 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
            <div className="w-6 h-6 rounded-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
          </div>
          <div className="h-4 w-12 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-4 w-20 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Action bar skeleton */}
      <div className="border-t border-gray-100">
        <div className="grid grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex items-center justify-center gap-2.5 py-3.5 ${
                i !== 3 ? "border-r border-gray-100" : ""
              }`}
            >
              <div className="w-5 h-5 rounded bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
              <div className="h-4 w-12 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments skeleton */}
      <div className="px-6 py-5 space-y-4 bg-linear-to-br from-gray-50/50 via-blue-50/20 to-purple-50/20 border-t border-gray-100">
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    </article>
  );
}
