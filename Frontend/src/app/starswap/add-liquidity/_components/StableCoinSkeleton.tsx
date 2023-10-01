import { Card, CardBody, CardFooter, Skeleton } from '@nextui-org/react'

interface StableCoinSkeletonProps {
    key: number
}
export const StableCoinSkeleton = (props: StableCoinSkeletonProps) => (
    <Card key={props.key} className="col-span-1"> 
        <CardBody>
            <Skeleton className="h-12 w-12 rounded-full"/>
        </CardBody>
        <CardFooter className="justify-center flex">
            <Skeleton className="h-5 w-4/5 rounded-full"/>
        </CardFooter>
    </Card>
)