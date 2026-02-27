import TripCalendarComponent from '@/components/TripCalendarComponent'
import { MonthData } from '@/types/TripCalendarType';

export default function page() {
    const months: MonthData[] = [
        {
            id: 'june',
            label: 'Juni',
            year: 2026,
            trips: [
                { dateStart: '02 Jun', dateEnd: '05 Jun', tour: 'Pesona Desa Penglipuran', tourLink: '/tours/1', duration: '3 hari', status: 'Booking dibuka', info: 'Pengalaman arsitektur tradisional Bali yang terawat sempurna, interaksi hangat dengan penduduk lokal.' },
                { dateStart: '10 Jun', dateEnd: '13 Jun', tour: 'Pesona Desa Penglipuran', tourLink: '/tours/1', duration: '3 hari', status: 'Booking dibuka', info: 'Pengalaman arsitektur tradisional Bali yang terawat sempurna, interaksi hangat dengan penduduk lokal.' },
                { dateStart: '05 Jun', dateEnd: '09 Jun', tour: 'Jelajah Desa Wae Rebo', tourLink: '/tours/2', duration: '4 hari', status: 'Booking dibuka', info: 'Petualangan menakjubkan menuju rumah adat Mbaru Niang di Flores melintasi hutan tropis.' },
                { dateStart: '15 Jun', dateEnd: '19 Jun', tour: 'Keindahan Nglanggeran', tourLink: '/tours/3', duration: '5 hari', status: 'Sisa 6 kursi', info: 'Wisata geologi dan budaya di lereng gunung api purba Yogyakarta dengan sunset yang memukau.' },
                { dateStart: '22 Jun', dateEnd: '28 Jun', tour: 'Jelajah Desa Manud Jaya', tourLink: '/tours/4', duration: '7 hari', status: 'Booking dibuka', info: 'Eksplorasi lengkap dataran tinggi, perkebunan teh, sungai alami, dan budaya Angklung.' },
            ],
        },
        {
            id: 'july',
            label: 'Juli',
            year: 2026,
            trips: [
                { dateStart: '03 Jul', dateEnd: '06 Jul', tour: 'Pesona Desa Penglipuran', tourLink: '/tours/1', duration: '3 hari', status: 'Booking dibuka', info: 'Pengalaman arsitektur tradisional Bali yang terawat sempurna, interaksi hangat dengan penduduk lokal.' },
                { dateStart: '08 Jul', dateEnd: '12 Jul', tour: 'Jelajah Desa Wae Rebo', tourLink: '/tours/2', duration: '4 hari', status: 'Sisa 5 kursi', info: 'Petualangan menakjubkan menuju rumah adat Mbaru Niang di Flores melintasi hutan tropis.' },
                { dateStart: '14 Jul', dateEnd: '18 Jul', tour: 'Keindahan Nglanggeran', tourLink: '/tours/3', duration: '5 hari', status: 'Booking dibuka', info: 'Wisata geologi dan budaya di lereng gunung api purba Yogyakarta dengan sunset yang memukau.' },
                { dateStart: '20 Jul', dateEnd: '26 Jul', tour: 'Jelajah Desa Manud Jaya', tourLink: '/tours/4', duration: '7 hari', status: 'Booking dibuka', info: 'Eksplorasi lengkap dataran tinggi, perkebunan teh, sungai alami, dan budaya Angklung.' },
                { dateStart: '25 Jul', dateEnd: '28 Jul', tour: 'Pesona Desa Penglipuran', tourLink: '/tours/1', duration: '3 hari', status: 'Sisa 3 kursi', info: 'Pengalaman arsitektur tradisional Bali yang terawat sempurna, interaksi hangat dengan penduduk lokal.' },
            ],
        },
        {
            id: 'august',
            label: 'Agustus',
            year: 2026,
            trips: [
                { dateStart: '01 Agu', dateEnd: '04 Agu', tour: 'Pesona Desa Penglipuran', tourLink: '/tours/1', duration: '3 hari', status: 'Booking dibuka', info: 'Pengalaman arsitektur tradisional Bali yang terawat sempurna, interaksi hangat dengan penduduk lokal.' },
                { dateStart: '05 Agu', dateEnd: '09 Agu', tour: 'Jelajah Desa Wae Rebo', tourLink: '/tours/2', duration: '4 hari', status: 'Sisa 8 kursi', info: 'Petualangan menakjubkan menuju rumah adat Mbaru Niang di Flores melintasi hutan tropis.' },
                { dateStart: '11 Agu', dateEnd: '15 Agu', tour: 'Keindahan Nglanggeran', tourLink: '/tours/3', duration: '5 hari', status: 'Booking dibuka', info: 'Wisata geologi dan budaya di lereng gunung api purba Yogyakarta dengan sunset yang memukau.' },
                { dateStart: '18 Agu', dateEnd: '24 Agu', tour: 'Jelajah Desa Manud Jaya', tourLink: '/tours/4', duration: '7 hari', status: 'Booking dibuka', info: 'Eksplorasi lengkap dataran tinggi, perkebunan teh, sungai alami, dan budaya Angklung.' },
            ],
        },
        {
            id: 'september',
            label: 'September',
            year: 2026,
            trips: [
                { dateStart: '01 Sep', dateEnd: '04 Sep', tour: 'Pesona Desa Penglipuran', tourLink: '/tours/1', duration: '3 hari', status: 'Booking dibuka', info: 'Pengalaman arsitektur tradisional Bali yang terawat sempurna, interaksi hangat dengan penduduk lokal.' },
                { dateStart: '07 Sep', dateEnd: '11 Sep', tour: 'Jelajah Desa Wae Rebo', tourLink: '/tours/2', duration: '4 hari', status: 'Booking dibuka', info: 'Petualangan menakjubkan menuju rumah adat Mbaru Niang di Flores melintasi hutan tropis.' },
                { dateStart: '14 Sep', dateEnd: '18 Sep', tour: 'Keindahan Nglanggeran', tourLink: '/tours/3', duration: '5 hari', status: 'Booking dibuka', info: 'Wisata geologi dan budaya di lereng gunung api purba Yogyakarta dengan sunset yang memukau.' },
                { dateStart: '21 Sep', dateEnd: '27 Sep', tour: 'Jelajah Desa Manud Jaya', tourLink: '/tours/4', duration: '7 hari', status: 'Sisa 4 kursi', info: 'Eksplorasi lengkap dataran tinggi, perkebunan teh, sungai alami, dan budaya Angklung.' },
            ],
        },
    ];
    return (
        <TripCalendarComponent months={months} />
    )
}
