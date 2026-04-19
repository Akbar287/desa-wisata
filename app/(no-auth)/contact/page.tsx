import { prisma } from "@/lib/prisma";
import ContactComponents from '@/components/ContactComponents'

export default async function page() {
    const profile = await prisma.villageProfile.findFirst({
        include: {
            visions: true,
            missions: true,
            galleries: true,
        },
    });
    const data = profile || {
        history: "",
        videoUrl: "",
        address: "",
        phone: "",
        email: "",
        visions: [],
        missions: [],
        galleries: [],
    };
    return (
        <ContactComponents
            address={data.address}
            phone={data.phone}
            email={data.email}/>
    )
}
