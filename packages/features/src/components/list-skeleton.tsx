import { Skeleton } from "./ui/skeleton"

export const ListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
    </div>
  )
}
