import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard = ({ count = 6 }: SkeletonCardProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card-elevated bg-card overflow-hidden mb-8">
          <Skeleton height={200} className="w-full" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton circle width={32} height={32} />
              <div>
                <Skeleton width={80} height={14} />
                <Skeleton width={60} height={12} />
              </div>
            </div>
            <Skeleton width="80%" height={24} className="mb-3" />
            <Skeleton width="100%" height={16} className="mb-2" />
            <Skeleton width="60%" height={16} />
          </div>
        </div>
      ))}
    </>
  );
};
