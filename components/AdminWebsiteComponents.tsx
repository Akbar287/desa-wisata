import React from 'react'
import { SiteHeader } from './layouts/site-header'

export default function AdminWebsiteComponents() {
    return (
        <React.Fragment>
            <SiteHeader title="CMS Website" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
