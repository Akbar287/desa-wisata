import TestimonialUserComponents from "@/components/TestimonialUserComponents";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { TestimonialUserPageData } from "@/types/TestimonialType";

export default async function TestimonialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kodeBooking = decodeURIComponent(id || "")
    .trim()
    .toUpperCase();
  if (!kodeBooking) notFound();

  const booking = await prisma.bookingPayment.findUnique({
    where: {
      bookingCode: kodeBooking,
    },
    include: {
      booking: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          startDate: true,
          totalPrice: true,
          tour: { select: { title: true } },
          destination: { select: { name: true } },
          wahana: { select: { name: true } },
        },
      },
    },
  });

  if (!booking) notFound();

  const existingTestimonial = await prisma.testimonial.findFirst({
    where: { bookingId: booking.booking.id },
    include: {
      images: {
        select: {
          id: true,
          fileName: true,
          mimeType: true,
          size: true,
        },
        orderBy: { id: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const itemName =
    booking.booking.tour?.title ??
    booking.booking.destination?.name ??
    booking.booking.wahana?.name ??
    "Paket Wisata Desa Manud Jaya";

  const initialData: TestimonialUserPageData = {
    bookingCode: booking.bookingCode,
    bookingId: booking.booking.id,
    customerName:
      `${booking.booking.firstName} ${booking.booking.lastName}`.trim(),
    customerEmail: booking.booking.email,
    itemName,
    visitDate: booking.booking.startDate.toISOString(),
    existingTestimonial: existingTestimonial
      ? {
          id: existingTestimonial.id,
          isPublished: existingTestimonial.isPublished,
          name: existingTestimonial.name,
          role: existingTestimonial.role,
          text: existingTestimonial.text,
          rating: existingTestimonial.rating,
          createdAt: existingTestimonial.createdAt.toISOString(),
          images: existingTestimonial.images.map((img) => ({
            id: img.id,
            url: `/api/testimonials/images/${img.id}`,
            fileName: img.fileName,
            mimeType: img.mimeType,
            size: img.size,
          })),
        }
      : null,
  };

  return <TestimonialUserComponents initialData={initialData} />;
}
