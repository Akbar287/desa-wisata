import ProfileComponent from "@/components/ProfileComponent";

export default function ProfilePage() {
    const potensiAlam = [
        {
            title: "Healing & Eco-Tourism",
            desc: "Lanskap perbukitan dengan panorama alami dan udara sejuk yang sempurna untuk healing tourism dan eco-tourism.",
            icon: "🏔️",
        },
        {
            title: "Rekreasi Sungai",
            desc: "Aliran sungai alami yang dapat dikembangkan sebagai area rekreasi, river tubing, dan spot fotografi.",
            icon: "🏞️",
        },
        {
            title: "Camping & Glamping",
            desc: "Lahan terbuka luas untuk camping ground, glamping area, dan aktivitas outdoor yang menyegarkan.",
            icon: "⛺",
        },
        {
            title: "Outbound & Adventure",
            desc: "Flying fox, paintball, ATV keliling kebun teh, dan jeep offroad di alam pegunungan.",
            icon: "🎯",
        },
    ];

    const potensiAgro = [
        {
            title: "Perkebunan Teh",
            desc: "Paket edukasi pertanian — pengalaman memanen dan mengolah hasil kebun teh langsung dari perkebunan.",
            image: "/assets/e50bd774-982a-4206-b5b9-3ace3c9c8f27-gobi_gallery1.jpg",
        },
        {
            title: "Kebun Strawberry",
            desc: "Petik strawberry langsung dari kebun, edukasi cara penanaman, dan pengolahan strawberry segar.",
            image: "/assets/9b4e5aa3-5ec7-4c73-b146-e0f45b9eff94-mistakes_Gallery_road.jpg",
        },
    ];

    const galleryImages = [
        "/assets/withus01.png",
        "/assets/withus02.png",
        "/assets/withus03.png",
        "/assets/withus05.png",
        "/assets/withus06.png",
        "/assets/withus07.png",
        "/assets/withus08.png",
        "/assets/e50bd774-982a-4206-b5b9-3ace3c9c8f27-gobi_gallery1.jpg",
        "/assets/withus07.png",
        "/assets/withus08.png",
    ];


    return <ProfileComponent
        potensiAlam={potensiAlam}
        potensiAgro={potensiAgro}
        galleryImages={galleryImages}
    />

}
