import BookingComponents from "@/components/BookingComponents";
import { prisma } from "@/lib/prisma";

const NATIONALITIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "The Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Democratic Republic of the Congo",
  "Republic of Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "The Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "North Korea",
  "South Korea",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom (UK)",
  "United States (USA)",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const PHONE_CODES = [
  { code: "+93", flag: "🇦🇫", country: "Afghanistan" },
  { code: "+355", flag: "🇦🇱", country: "Albania" },
  { code: "+213", flag: "🇩🇿", country: "Algeria" },
  { code: "+376", flag: "🇦🇩", country: "Andorra" },
  { code: "+244", flag: "🇦🇴", country: "Angola" },
  { code: "+54", flag: "🇦🇷", country: "Argentina" },
  { code: "+374", flag: "🇦🇲", country: "Armenia" },
  { code: "+61", flag: "🇦🇺", country: "Australia" },
  { code: "+43", flag: "🇦🇹", country: "Austria" },
  { code: "+994", flag: "🇦🇿", country: "Azerbaijan" },
  { code: "+973", flag: "🇧🇭", country: "Bahrain" },
  { code: "+880", flag: "🇧🇩", country: "Bangladesh" },
  { code: "+375", flag: "🇧🇾", country: "Belarus" },
  { code: "+32", flag: "🇧🇪", country: "Belgium" },
  { code: "+501", flag: "🇧🇿", country: "Belize" },
  { code: "+229", flag: "🇧🇯", country: "Benin" },
  { code: "+975", flag: "🇧🇹", country: "Bhutan" },
  { code: "+591", flag: "🇧🇴", country: "Bolivia" },
  { code: "+387", flag: "🇧🇦", country: "Bosnia" },
  { code: "+267", flag: "🇧🇼", country: "Botswana" },
  { code: "+55", flag: "🇧🇷", country: "Brazil" },
  { code: "+673", flag: "🇧🇳", country: "Brunei" },
  { code: "+359", flag: "🇧🇬", country: "Bulgaria" },
  { code: "+226", flag: "🇧🇫", country: "Burkina Faso" },
  { code: "+257", flag: "🇧🇮", country: "Burundi" },
  { code: "+855", flag: "🇰🇭", country: "Cambodia" },
  { code: "+237", flag: "🇨🇲", country: "Cameroon" },
  { code: "+1", flag: "🇨🇦", country: "Canada" },
  { code: "+56", flag: "🇨🇱", country: "Chile" },
  { code: "+86", flag: "🇨🇳", country: "China" },
  { code: "+57", flag: "🇨🇴", country: "Colombia" },
  { code: "+506", flag: "🇨🇷", country: "Costa Rica" },
  { code: "+385", flag: "🇭🇷", country: "Croatia" },
  { code: "+53", flag: "🇨🇺", country: "Cuba" },
  { code: "+357", flag: "🇨🇾", country: "Cyprus" },
  { code: "+420", flag: "🇨🇿", country: "Czech Republic" },
  { code: "+45", flag: "🇩🇰", country: "Denmark" },
  { code: "+593", flag: "🇪🇨", country: "Ecuador" },
  { code: "+20", flag: "🇪🇬", country: "Egypt" },
  { code: "+503", flag: "🇸🇻", country: "El Salvador" },
  { code: "+372", flag: "🇪🇪", country: "Estonia" },
  { code: "+251", flag: "🇪🇹", country: "Ethiopia" },
  { code: "+679", flag: "🇫🇯", country: "Fiji" },
  { code: "+358", flag: "🇫🇮", country: "Finland" },
  { code: "+33", flag: "🇫🇷", country: "France" },
  { code: "+995", flag: "🇬🇪", country: "Georgia" },
  { code: "+49", flag: "🇩🇪", country: "Germany" },
  { code: "+233", flag: "🇬🇭", country: "Ghana" },
  { code: "+30", flag: "🇬🇷", country: "Greece" },
  { code: "+502", flag: "🇬🇹", country: "Guatemala" },
  { code: "+509", flag: "🇭🇹", country: "Haiti" },
  { code: "+504", flag: "🇭🇳", country: "Honduras" },
  { code: "+852", flag: "🇭🇰", country: "Hong Kong" },
  { code: "+36", flag: "🇭🇺", country: "Hungary" },
  { code: "+354", flag: "🇮🇸", country: "Iceland" },
  { code: "+91", flag: "🇮🇳", country: "India" },
  { code: "+62", flag: "🇮🇩", country: "Indonesia" },
  { code: "+98", flag: "🇮🇷", country: "Iran" },
  { code: "+964", flag: "🇮🇶", country: "Iraq" },
  { code: "+353", flag: "🇮🇪", country: "Ireland" },
  { code: "+972", flag: "🇮🇱", country: "Israel" },
  { code: "+39", flag: "🇮🇹", country: "Italy" },
  { code: "+81", flag: "🇯🇵", country: "Japan" },
  { code: "+962", flag: "🇯🇴", country: "Jordan" },
  { code: "+7", flag: "🇰🇿", country: "Kazakhstan" },
  { code: "+254", flag: "🇰🇪", country: "Kenya" },
  { code: "+82", flag: "🇰🇷", country: "South Korea" },
  { code: "+965", flag: "🇰🇼", country: "Kuwait" },
  { code: "+996", flag: "🇰🇬", country: "Kyrgyzstan" },
  { code: "+856", flag: "🇱🇦", country: "Laos" },
  { code: "+371", flag: "🇱🇻", country: "Latvia" },
  { code: "+961", flag: "🇱🇧", country: "Lebanon" },
  { code: "+370", flag: "🇱🇹", country: "Lithuania" },
  { code: "+352", flag: "🇱🇺", country: "Luxembourg" },
  { code: "+60", flag: "🇲🇾", country: "Malaysia" },
  { code: "+960", flag: "🇲🇻", country: "Maldives" },
  { code: "+356", flag: "🇲🇹", country: "Malta" },
  { code: "+52", flag: "🇲🇽", country: "Mexico" },
  { code: "+373", flag: "🇲🇩", country: "Moldova" },
  { code: "+377", flag: "🇲🇨", country: "Monaco" },
  { code: "+976", flag: "🇲🇳", country: "Mongolia" },
  { code: "+382", flag: "🇲🇪", country: "Montenegro" },
  { code: "+212", flag: "🇲🇦", country: "Morocco" },
  { code: "+258", flag: "🇲🇿", country: "Mozambique" },
  { code: "+977", flag: "🇳🇵", country: "Nepal" },
  { code: "+31", flag: "🇳🇱", country: "Netherlands" },
  { code: "+64", flag: "🇳🇿", country: "New Zealand" },
  { code: "+505", flag: "🇳🇮", country: "Nicaragua" },
  { code: "+234", flag: "🇳🇬", country: "Nigeria" },
  { code: "+47", flag: "🇳🇴", country: "Norway" },
  { code: "+968", flag: "🇴🇲", country: "Oman" },
  { code: "+92", flag: "🇵🇰", country: "Pakistan" },
  { code: "+507", flag: "🇵🇦", country: "Panama" },
  { code: "+595", flag: "🇵🇾", country: "Paraguay" },
  { code: "+51", flag: "🇵🇪", country: "Peru" },
  { code: "+63", flag: "🇵🇭", country: "Philippines" },
  { code: "+48", flag: "🇵🇱", country: "Poland" },
  { code: "+351", flag: "🇵🇹", country: "Portugal" },
  { code: "+974", flag: "🇶🇦", country: "Qatar" },
  { code: "+40", flag: "🇷🇴", country: "Romania" },
  { code: "+7", flag: "🇷🇺", country: "Russia" },
  { code: "+966", flag: "🇸🇦", country: "Saudi Arabia" },
  { code: "+381", flag: "🇷🇸", country: "Serbia" },
  { code: "+65", flag: "🇸🇬", country: "Singapore" },
  { code: "+421", flag: "🇸🇰", country: "Slovakia" },
  { code: "+386", flag: "🇸🇮", country: "Slovenia" },
  { code: "+27", flag: "🇿🇦", country: "South Africa" },
  { code: "+34", flag: "🇪🇸", country: "Spain" },
  { code: "+94", flag: "🇱🇰", country: "Sri Lanka" },
  { code: "+46", flag: "🇸🇪", country: "Sweden" },
  { code: "+41", flag: "🇨🇭", country: "Switzerland" },
  { code: "+886", flag: "🇹🇼", country: "Taiwan" },
  { code: "+255", flag: "🇹🇿", country: "Tanzania" },
  { code: "+66", flag: "🇹🇭", country: "Thailand" },
  { code: "+216", flag: "🇹🇳", country: "Tunisia" },
  { code: "+90", flag: "🇹🇷", country: "Turkey" },
  { code: "+380", flag: "🇺🇦", country: "Ukraine" },
  { code: "+971", flag: "🇦🇪", country: "UAE" },
  { code: "+44", flag: "🇬🇧", country: "UK" },
  { code: "+1", flag: "🇺🇸", country: "USA" },
  { code: "+598", flag: "🇺🇾", country: "Uruguay" },
  { code: "+998", flag: "🇺🇿", country: "Uzbekistan" },
  { code: "+58", flag: "🇻🇪", country: "Venezuela" },
  { code: "+84", flag: "🇻🇳", country: "Vietnam" },
  { code: "+967", flag: "🇾🇪", country: "Yemen" },
  { code: "+260", flag: "🇿🇲", country: "Zambia" },
  { code: "+263", flag: "🇿🇼", country: "Zimbabwe" },
];

const FIND_US_OPTIONS = [
  "Google / Mesin Pencari",
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "Teman / Keluarga",
  "Blog / Artikel",
  "Pameran Wisata",
  "Lainnya",
];

const STEPS = [
  {
    num: 1,
    label: "Pilih Tur",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    num: 2,
    label: "Isi Data",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    num: 3,
    label: "Pembayaran",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    num: 4,
    label: "Konfirmasi",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    num: 5,
    label: "Selamat Berlibur!",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
];

const parseGuidePrice = (value: string | null | undefined): number => {
  const digits = (value ?? "").replace(/[^\d]/g, "");
  if (!digits) return 0;
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatGuidePrice = (value: number, raw: string | null | undefined) => {
  if (value > 0) return `Rp ${value.toLocaleString("id-ID")}`;
  const text = (raw ?? "").trim();
  return text || "Rp 0";
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string;
    start?: string;
    end?: string;
    jenis?: string;
  }>;
}) {
  const { id, start, end, jenis } = await searchParams;
  const itemId = Number(id);
  const bookingType = jenis || "paket-wisata";

  let tourLookup: Record<
    string,
    {
      id: number;
      title: string;
      duration: string;
      price: number;
      priceWeekday?: number;
      priceWeekend?: number;
    }
  > = {};
  let dailyQuota = 0;
  // For wahana/destinasi: collect existing booking counts per date for calendar availability
  let bookingCounts: Record<string, number> = {};

  if (itemId && !isNaN(itemId)) {
    if (bookingType === "destinasi") {
      const dest = await prisma.destination.findUnique({
        where: { id: itemId },
        select: {
          id: true,
          name: true,
          priceWeekday: true,
          priceWeekend: true,
          KuotaHarian: true,
        },
      });
      if (dest) {
        dailyQuota = dest.KuotaHarian;
        tourLookup[String(dest.id)] = {
          id: dest.id,
          title: dest.name,
          duration: "1 hari",
          price: dest.priceWeekday,
          priceWeekday: dest.priceWeekday,
          priceWeekend: dest.priceWeekend,
        };
        // Get booking counts for the next 90 days
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const futureEnd = new Date(now);
        futureEnd.setDate(futureEnd.getDate() + 90);
        const bookings = await prisma.booking.findMany({
          where: {
            tourId: dest.id,
            startDate: { gte: now, lte: futureEnd },
            status: { not: "CANCELLED" },
          },
          select: { startDate: true, adults: true, children: true },
        });
        for (const b of bookings) {
          const key = b.startDate.toISOString().split("T")[0];
          bookingCounts[key] =
            (bookingCounts[key] || 0) + b.adults + b.children;
        }
      }
    } else if (bookingType === "wahana") {
      const wahana = await prisma.wahana.findUnique({
        where: { id: itemId },
        select: { id: true, name: true, price: true },
      });
      if (wahana) {
        dailyQuota = 100; // Default capacity for wahana
        tourLookup[String(wahana.id)] = {
          id: wahana.id,
          title: wahana.name,
          duration: "1 hari",
          price: wahana.price,
          priceWeekday: wahana.price,
          priceWeekend: wahana.price,
        };
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const futureEnd = new Date(now);
        futureEnd.setDate(futureEnd.getDate() + 90);
        const bookings = await prisma.booking.findMany({
          where: {
            tourId: wahana.id,
            startDate: { gte: now, lte: futureEnd },
            status: { not: "CANCELLED" },
          },
          select: { startDate: true, adults: true, children: true },
        });
        for (const b of bookings) {
          const key = b.startDate.toISOString().split("T")[0];
          bookingCounts[key] =
            (bookingCounts[key] || 0) + b.adults + b.children;
        }
      }
    } else {
      // paket-wisata — existing logic
      const dbTour = await prisma.tour.findUnique({
        where: { id: itemId },
        select: {
          id: true,
          title: true,
          durationDays: true,
          price: true,
          dates: { orderBy: { startDate: "asc" } },
        },
      });

      if (dbTour) {
        let selectedPrice = dbTour.price;
        const fmtDate = (d: Date) =>
          d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

        if (start && end && dbTour.dates.length > 0) {
          const matchingDate = dbTour.dates.find(
            (d) => fmtDate(d.startDate) === start && fmtDate(d.endDate) === end,
          );
          if (matchingDate) {
            selectedPrice = matchingDate.price;
          }
        }

        tourLookup[String(dbTour.id)] = {
          id: dbTour.id,
          title: dbTour.title,
          duration: `${dbTour.durationDays} hari`,
          price: selectedPrice,
          priceWeekday: selectedPrice,
          priceWeekend: selectedPrice,
        };
      }
    }
  }

  const guideRows = await prisma.teamMember.findMany({
    where: {
      activeAdmin: true,
      status: "AKTIF",
      teamCategory: {
        title: {
          equals: "Tim Pemandu Wisata",
          mode: "insensitive",
        },
      },
    },
    orderBy: [{ order: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      role: true,
      avatar: true,
      experience: true,
      specialty: true,
      bio: true,
      anggotaTimNegara: {
        select: {
          negara: {
            select: {
              nama: true,
            },
          },
        },
      },
      teamHargaPemandu: {
        orderBy: { id: "desc" },
        take: 1,
        select: { harga: true },
      },
    },
  });

  const guideAddons = guideRows.map((guide) => {
    const hargaRaw = guide.teamHargaPemandu?.[0]?.harga ?? "";
    const hargaValue = parseGuidePrice(hargaRaw);
    return {
      id: guide.id,
      name: guide.name,
      role: guide.role,
      avatar: guide.avatar,
      experience: guide.experience,
      specialty: guide.specialty,
      bio: guide.bio,
      languages: guide.anggotaTimNegara
        .map((row) => row.negara?.nama ?? "")
        .filter(Boolean),
      hargaLabel: formatGuidePrice(hargaValue, hargaRaw),
      hargaValue,
    };
  });

  const guideBookingCountsByDate: Record<string, Record<string, number>> = {};
  const guideIds = guideRows.map((guide) => guide.id);

  if (guideIds.length > 0) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const guideBookings = await prisma.bookingTestimoniAddOn.findMany({
      where: {
        teamMemberId: { in: guideIds },
        booking: {
          startDate: { gte: now },
          status: { not: "CANCELLED" },
        },
      },
      select: {
        teamMemberId: true,
        booking: { select: { startDate: true } },
      },
    });

    for (const row of guideBookings) {
      const dateKey = row.booking.startDate.toISOString().split("T")[0];
      if (!guideBookingCountsByDate[dateKey]) {
        guideBookingCountsByDate[dateKey] = {};
      }
      const memberKey = String(row.teamMemberId);
      guideBookingCountsByDate[dateKey][memberKey] =
        (guideBookingCountsByDate[dateKey][memberKey] || 0) + 1;
    }
  }

  return (
    <BookingComponents
      nationalities={NATIONALITIES}
      findUsOptions={FIND_US_OPTIONS}
      phoneCodes={PHONE_CODES}
      tourLookup={tourLookup}
      guideAddons={guideAddons}
      guideBookingCountsByDate={guideBookingCountsByDate}
      steps={STEPS}
      bookingType={bookingType}
      dailyQuota={dailyQuota}
      bookingCounts={bookingCounts}
    />
  );
}
