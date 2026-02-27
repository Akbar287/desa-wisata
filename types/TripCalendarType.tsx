export interface TripEntry {
    dateStart: string;
    dateEnd: string;
    tour: string;
    tourLink: string;
    duration: string;
    status: string;
    info: string;
}

export interface MonthData {
    id: string;
    label: string;
    year: number;
    trips: TripEntry[];
}