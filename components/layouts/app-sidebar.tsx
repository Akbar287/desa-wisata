"use client"

import * as React from "react"
import { NavDocuments } from "@/components/layouts/nav-documents"
import { NavMain } from "@/components/layouts/nav-main"
import { NavSecondary } from "@/components/layouts/nav-secondary"
import { NavUser } from "@/components/layouts/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import { toast } from "sonner"
import { Binoculars, Building, Frame, HatGlasses, Landmark, LayoutDashboard, LucideSquirrel, Map, Mountain, Newspaper, PieChart, Quote, User, UserRoundSearch, Users } from "lucide-react"
import Link from "next/link"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession()

    const data = {
        navMain: [
            {
                title: "Dashboard",
                url: "/",
                icon: LayoutDashboard,
            },
            {
                title: "Kategori Tour",
                url: "/admin-category-tour",
                icon: HatGlasses,
            },
            {
                title: "Tema Tour",
                url: "/admin-theme-tour",
                icon: Mountain,
            },
            {
                title: "Destinasi",
                url: "/admin-destinasi",
                icon: Map,
            },
            {
                title: "Tour",
                url: "/admin-tour",
                icon: Binoculars,
            },
            {
                title: "Blog & Artikel",
                url: "/admin-blog",
                icon: Newspaper,
            },
            {
                title: "Testimoni",
                url: "/admin-testimoni",
                icon: Quote,
            },
            {
                title: "User",
                url: "/admin-user",
                icon: User,
            },
        ],
        documents: [
            {
                name: 'Profil Desa',
                url: '/admin-profile',
                icon: Landmark,
            },
            {
                name: 'Tim Kami',
                url: '/admin-team',
                icon: Users,
            },
            {
                name: 'Lowongan Kerja',
                url: '/admin-career',
                icon: UserRoundSearch,
            },
            {
                name: 'Yayasan Kami',
                url: '/admin-yayasan',
                icon: Building,
            },
        ],
        navSecondary: [
            {
                title: 'Buku Petunjuk',
                url: '/buku-petunjuk',
                icon: Frame,
            },
            {
                title: 'Proses Bisnis',
                url: '/proses-bisnis',
                icon: PieChart,
            },
        ],
    }

    const logout = () => {
        localStorage.removeItem('pmb.iti.role')
        toast('Sedang Mengeluarkan Anda')
        signOut({ callbackUrl: '/' })
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <Link href="/">
                                <LucideSquirrel className="size-5!" />
                                <span className="text-base font-semibold">Desa Wisata</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={session} logout={logout} />
            </SidebarFooter>
        </Sidebar>
    )
}
