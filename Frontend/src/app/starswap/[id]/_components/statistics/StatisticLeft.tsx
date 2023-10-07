import { Card, CardBody} from '@nextui-org/react'

interface PoolInfoProps {
    className?: string
}

export const StatisticLeft = (props: PoolInfoProps) => {
    return (
        <Card className={`${props.className}`}>
            <CardBody>
                3123
            </CardBody>
        </Card>
    )
}