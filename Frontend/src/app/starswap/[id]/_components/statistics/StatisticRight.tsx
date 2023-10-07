'use client'
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Tab,
    Tabs,
} from '@nextui-org/react'
import { VolumeChart } from './VolumeChart'
import { LPTokenDistributionChart } from './LPTokenDistributionChart'
import { LiquidityChart } from './LiquidityChart'
import { Fragment, useContext, useState } from 'react'
import { TokenContext } from '../../layout'

interface StatisticProps {
    className?: string
}

export const StatisticRight = (props: StatisticProps) => {

    const tokenState = useContext(TokenContext)
    
    return (
        <Card className={`flex w-full flex-col ${props.className}`}>
            <CardBody>
                <Tabs aria-label="Options">
                    <Tab key="photos" title="Photos">
                        <LiquidityChart/>
                    </Tab>
                    <Tab key="music" title="Music">
                        <VolumeChart/>
                    </Tab>
                    <Tab key="videos" title="Videos">
                        <LPTokenDistributionChart/>
                    </Tab>
                </Tabs>
            </CardBody>
        </Card>  
    )
}


export enum ChartCategoty {
    Liquidity,
    Volume,
    LPTokenDistribution,
  }

const categories = [
    {
        id: ChartCategoty.Liquidity,
        value: 'Liquidity'
    },
    {
        id: ChartCategoty.Volume,
        value: 'Volume'
    },
    {
        id: ChartCategoty.LPTokenDistribution,
        value: 'LP Token Distribution'
    }
]