import GalleryComponents from "@/components/GalleryComponents";
import { getGalleryPageData } from "@/services/GalleryServices";

const GALLERY_LIMIT = 12;

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const pageQuery = Number(params.page ?? "1");
  const page = Number.isFinite(pageQuery) && pageQuery > 0 ? pageQuery : 1;
  const galleryData = await getGalleryPageData({
    page,
    limit: GALLERY_LIMIT,
  });

  return <GalleryComponents galleryData={galleryData} />;
}
