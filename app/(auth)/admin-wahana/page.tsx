import AdminWahanaComponents from "@/components/AdminWahanaComponents";

export default function page() {
  const googleMapsApiKey = (
    process.env.NEXT_PUBLIC_GMAPS_API ??
    process.env.NEXT_GMAPS_API ??
    ""
  ).trim();
  const googleMapsMapId = (
    process.env.NEXT_PUBLIC_GMAPS_MAP_ID ??
    process.env.NEXT_GMAPS_MAP_ID ??
    ""
  ).trim();

  return (
    <AdminWahanaComponents
      googleMapsApiKey={googleMapsApiKey}
      googleMapsMapId={googleMapsMapId}
    />
  );
}
