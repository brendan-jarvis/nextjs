import Blog from "@/app/_components/Blog/BlogPage";

export default function Page({ params }: { params: { id: string } }) {
  console.log("Id is: ", params.id);
  console.log("Typeof Id is: ", typeof params.id);
  return <Blog id={Number(params.id)} />;
}
