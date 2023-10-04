'use client'
import { Swap } from '@app/starswap/_components'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

const Page = () => {
    const router = useRouter()
    return (
        <Button onPress={() => router.push('http://localhost:3000/starswap/0x1c03BC75a96bc13cf3AafB86a58a7f206399235E/farm')} />
    )
}
export default Page
