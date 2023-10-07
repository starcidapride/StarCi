'use client'
import { IChartApi, ISeriesApi } from 'lightweight-charts'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    ChainName,
    ChartInterval,
    calcRedenomination,
    createBaselineChart,
    createCandlestickChart,
    generateCandlestickChartPriceData,
    updateBaselineChartData,
    updateCandlestickChartData,
} from '@utils'
import { PoolAddressContext, TokenContext } from '../../layout'
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Select,
    Skeleton,
    Tab,
    Tabs,
} from '@nextui-org/react'
import { RootState } from '@redux'
import { getTicks } from '@web3'
import { useSelector } from 'react-redux'
import { PriceImpact } from '@app/_components'

interface LiquidityPoolChartProps {
  className?: string;
}

export const PriceChart = (props: LiquidityPoolChartProps) => {
    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName,
    )
    const poolAddress = useContext(PoolAddressContext)

    const [ticks, setTicks] = useState<ChartTick[]>([])

    const tokenState = useContext(TokenContext)

    const [chartInterval, setChartInterval] = useState<ChartInterval>(
        ChartInterval._24H,
    )

    const [chartType, setChartType] = useState<ChartType>(ChartType.Token0Price)

    const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>

    const seriesRef = useRef<ISeriesApi<'Baseline'>|null>(null)
    useEffect(() => {
        const clientWidth = chartContainerRef.current.clientWidth

        const _chartGroup = createBaselineChart(
            chartContainerRef.current,
            chartInterval,
        )
        const chart = _chartGroup.chart
        const series = _chartGroup.series
        seriesRef.current = series

        const handleResize = () => {
            chart.applyOptions({ width: clientWidth })
        }
        
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutAuth) return

        const handleEffect = async () => {
            const _ticks = await getTicks(chainName, poolAddress)

            if (_ticks == null) return

            const _priceTicks = _ticks.map(
                tick => {
                    return {
                        previousToken0Price: calcRedenomination(tick.previousToken0Price, tokenState.token0Decimals, 3),
                        token0Price : calcRedenomination(tick.token0Price, tokenState.token0Decimals, 3),
                        time: tick.timestamp
                    }
                }
            )   
            const _priceData = _priceTicks.map(_tick => {
                return {
                    time: _tick.time,
                    value: _tick.token0Price
                }
            })
            console.log(_priceTicks)

            if (seriesRef.current == null) return
            
            updateBaselineChartData(seriesRef.current, _priceData)
        }

        handleEffect()
    }, [chartInterval, setChartType, tokenState.finishLoadWithoutAuth])
    return (
        <Card className={`${props.className}`}>
            <CardBody>
                <div
                    className="flex items-begin justify-between"
                >   
                    <div>
                        <div>
                            <span className="text-2xl font-bold"> {tokenState.token0Price}</span>
                            <span>
                                {' '}
                                {tokenState.token0Symbol}/{tokenState.token1Symbol}
                            </span>
                        </div>
                        <PriceImpact
                            token0BasePrice={tokenState.token0BasePrice}
                            token0Price={tokenState.token0Price}
                            finishLoad = {tokenState.finishLoadWithoutAuth}
                        />
                    </div>
                    <Tabs
                        size="sm"
                        variant="solid"
                        isDisabled={!tokenState.finishLoadWithoutAuth}
                        selectedKey={chartInterval.toString()}
                        onSelectionChange={(key) => {
                            const _key = Number(key)
                            setChartInterval(_key)
                        }}
                        classNames={{
                            cursor: 'bg-teal-500 text-white',
                            tabContent: 'font-bold group-data-[selected=true]:text-white',
                        }}
                    >
                        {intervals.map((interval) => (
                            <Tab key={interval.id} title={interval.value} />
                        ))}
                    </Tabs>
                    {!tokenState.finishLoadWithoutAuth ? (
                        <Tabs
                            size="sm"
                            variant="solid"
                            isDisabled={tokenState.finishLoadWithoutAuth}
                        >
                            {intervals.map((interval) => (
                                <Tab key={interval.id} title={interval.value} />
                            ))}
                        </Tabs>
                    ) : null}
                </div>
                <div className="mt-6 w-full" ref={chartContainerRef} />{' '}
            </CardBody>
        </Card>
    )
}

export enum ChartType {
  Token0Price,
  Token1Price,
}

const intervals = [
    {
        id: ChartInterval._24H,
        value: '24H',
    },
    {
        id: ChartInterval._1W,
        value: '1W',
    },
    {
        id: ChartInterval._1M,
        value: '1M',
    },
    {
        id: ChartInterval._1Y,
        value: '1Y',
    },
]

export const data = [
    {
        time: new Date('2023-04-11 09:43'),
        open: 180.34,
        high: 180.99,
        low: 178.57,
        close: 179.85,
    },
    {
        time: new Date('2023-04-11 09:44'),
        open: 180.82,
        high: 181.4,
        low: 177.56,
        close: 178.75,
    },
    {
        time: new Date('2023-9-11 09:46'),
        open: 178.58,
        high: 182.37,
        low: 176.31,
        close: 176.97,
    },
    {
        time: new Date('2019-04-11 09:47'),
        open: 177.52,
        high: 180.5,
        low: 176.83,
        close: 179.07,
    },
    {
        time: new Date('2019-05-11 09:48'),
        open: 175.77,
        high: 179.49,
        low: 175.44,
        close: 178.53,
    },
    {
        time: new Date('2019-05-11 09:54'),
        open: 187.0,
        high: 188.5,
        low: 185.75,
        close: 186.25,
    },
    {
        time: new Date('2019-04-11 09:55'),
        open: 186.4,
        high: 187.8,
        low: 185.2,
        close: 187.5,
    },
    {
        time: new Date('2019-04-11 09:56'),
        open: 187.7,
        high: 189.2,
        low: 186.5,
        close: 188.9,
    },
    {
        time: new Date('2019-04-11 09:57'),
        open: 189.0,
        high: 190.5,
        low: 188.1,
        close: 189.75,
    },
    {
        time: new Date('2019-04-11 09:58'),
        open: 189.8,
        high: 191.2,
        low: 188.7,
        close: 190.5,
    },
]
