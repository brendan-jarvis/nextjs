import Modal from "@/app/_components/Modal";
import Blog from "@/app/_components/Blog/BlogPage";

export default async function BlogModal({
  params,
}: {
  params: { id: number };
}) {
  return (
    <Modal>
      <Blog id={Number(params.id)} />
    </Modal>
  );
}
