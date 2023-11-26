import Blog from "@/app/_components/Blog/BlogPage";

export default function Page({ params }: { params: { id: string } }) {
  return <Blog id={Number(params.id)} />;
}
