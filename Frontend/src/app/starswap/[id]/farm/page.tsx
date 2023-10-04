'use client'

import { MainSection } from './_components/MainSection'
interface PagePrams {
    params: { id: string }
}
const Page = ({ params }: PagePrams) => {
    return (
        <div>
            <MainSection poolAddress={ params.id }/>
        </div>
    )
}

export default Page
