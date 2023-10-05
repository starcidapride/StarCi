'use client'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

const Page = () => {
    const router = useRouter()
    return (
        <Button onPress={() => router.push('http://localhost:3000/starswap/0x0381Ed09110e563Da1de86FFa54d005CB02936E1/farm')} />
    )
}
export default Page
