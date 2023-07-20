import { Skeleton } from "../ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
  );
}
