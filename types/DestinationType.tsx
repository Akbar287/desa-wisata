export interface DestinationFormData {
  name: string;
}

export interface DestinationData {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tours: number;
  };
}

export interface DestinationListItem {
  id: number;
  name: string;
  imageBanner: string;
  isAktif: boolean;
  priceWeekday: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  _count?: { tours: number; destinationGalleries: number };
}

export interface DestinationGalleryItem {
  id: number;
  image: string;
  createdAt: string;
}

export interface DestinationMapItem {
  id: number;
  title: string;
  content: string;
  image: string;
  icon: string;
  lat: number;
  lng: number;
  fasilitas: boolean;
}

export interface DestinationMapRelationItem {
  id: number;
  destinationId: number;
  mapId: number;
  order: number;
  map: DestinationMapItem;
}

export interface DestinationDetail {
  id: number;
  name: string;
  priceWeekend: number;
  priceWeekday: number;
  priceGroup: number;
  minimalGroup: number;
  jamBuka: string;
  jamTutup: string;
  durasiRekomendasi: string;
  isAktif: boolean;
  imageBanner: string;
  description: string;
  KuotaHarian: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  destinationGalleries: DestinationGalleryItem[];
  destinationLabels: { labelId: number; label: { id: number; name: string } }[];
  destinationAccessibilities: {
    accessibilityId: number;
    accessibility: { id: number; name: string };
  }[];
  destinationFacilities: {
    facilityId: number;
    facility: { id: number; name: string };
  }[];
  maps: DestinationMapRelationItem[];
}

export interface RefOption {
  id: number;
  name: string;
}
