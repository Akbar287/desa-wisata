export interface WahanaFormData {
  name: string;
  price: number;
  description: string;
  imageBanner: string;
  gallery: { image: string }[];
  mapIds: number[];
}

export interface WahanaMapItem {
  id: number;
  title: string;
  content: string;
  image: string;
  icon: string;
  lat: number;
  lng: number;
  fasilitas: boolean;
  order: number;
  mapId?: number;
  wahanaId?: number;
}

export interface WahanaData {
  id: number;
  name: string;
  price: number;
  description: string;
  imageBanner: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  WahanaGallery: {
    id: number;
    image: string;
  }[];
  maps?: WahanaMapItem[];
}
