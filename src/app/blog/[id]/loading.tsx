import { Skeleton } from "@/app/_components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl">
      <Skeleton className="max-w-1/2 my-2 h-9 w-full bg-seafoam-green py-2 text-center text-3xl font-bold uppercase" />
      <Skeleton className="max-w-1/2 my-2 h-5 w-full bg-sunny-yellow p-1 text-center text-sm" />
      <Skeleton className="max-w-1/2 mx-auto h-72 w-full bg-stone-200" />
    </div>
  );
}
