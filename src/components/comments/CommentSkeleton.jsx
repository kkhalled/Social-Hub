
export default function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      {/* Avatar skeleton */}
      <div className="w-10 h-10 rounded-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse shrink"></div>
      
      {/* Comment bubble skeleton */}
      <div className="flex-1 space-y-2">
        <div className="bg-linear-to-br from-gray-100 to-gray-50 rounded-2xl rounded-tl-md px-4 py-3 space-y-2">
          <div className="h-3 w-20 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-5/6 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Actions skeleton */}
        <div className="flex items-center gap-4 px-1">
          <div className="h-3 w-8 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-10 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
