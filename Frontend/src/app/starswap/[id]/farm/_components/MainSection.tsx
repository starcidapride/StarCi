import { ArrowRightOnRectangleIcon, ArrowsRightLeftIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Button, ButtonGroup, Card, CardBody, CardHeader, Divider, Input, Skeleton, Spinner, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, getKeyValue } from '@nextui-org/react'
import { Fragment, useContext, useEffect, useReducer, useState } from 'react'
import { Address } from 'web3'
import { useAsyncList } from '@react-stately/data'
import { initialTokenState, tokenReducer } from '@app/starswap/_context'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { PoolAddressContext, TokenContext } from '../../layout'
import { calcRedenomination } from '@utils'
import { BlockModal } from '.'
import { AppDispatch, RootState } from '../../../../../redux/store'
import { setMetamaskVisible } from '../../../../../redux/slices'

interface MainSectionProps {
    className?: string
}

export const MainSection = (props: FarmSectionProps) => {
    const [isLoading, setIsLoading] = useState(true)

    const tokenState = useContext(TokenContext)

    const list = useAsyncList({
        async load({ signal }) {
            const res = await fetch('https://swapi.py4e.com/api/people/?search', {
                signal,
            })
            const json = await res.json()
            setIsLoading(false)

            return {
                items: json.results,
            }
        },
        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a, b) => {
                    const first = a[sortDescriptor.column]
                    const second = b[sortDescriptor.column]
                    let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1

                    if (sortDescriptor.direction === 'descending') {
                        cmp *= -1
                    }

                    return cmp
                }),
            }
        },
    })


    return (
        <Fragment>
            <BlockModal />
            <Card className="m-auto">
                <CardHeader className="p-5 font-bold"> Farm </CardHeader>
                <Divider />
                <CardBody>
                    <div className="grid grid-cols-3">
                        <div className="col-span-1">
                            <div className="text-sm font-bold text-teal-500"> Farming Token Holding </div>
                            <div className="mt-4">
                                <div className="flex gap-3 items-end">
                                    <div className="gap-2 flex items-end">
                                        <div className="text-4xl font-bold">
                                            {
                                                tokenState.finishLoadWithAuth
                                                    ? tokenState.farmingTokenBalance
                                                    : 0
                                            }
                                        </div>

                                        {tokenState.finishLoadWithoutAuth
                                            ? <div className="text-sm"> {tokenState.farmingTokenSymbol}</div>
                                            : <Skeleton className="h-5 w-5 rounded-xl" />
                                        }

                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Button variant="flat"
                                        isIconOnly
                                        className="rounded-full"
                                        endContent={<PlusIcon height={24} width={24} />}
                                    />
                                    <Button variant="flat"
                                        isIconOnly
                                        className="rounded-full"
                                        endContent={<ArrowsRightLeftIcon height={24} width={24} />}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="-mt-2.5">
                                <Tabs variant="underlined"
                                    classNames={{
                                        cursor: 'bg-teal-500 text-white',
                                        tabContent: 'font-bold group-data-[selected=true]:text-teal-500',
                                    }}>
                                    <Tab key="photos" title="Rewards" />
                                    <Tab key="music" title="Deposits" />
                                    <Tab key="videos" title="Withdrawals" />
                                </Tabs>
                                <Table
                                    aria-label="Example table with client side sorting"
                                    sortDescriptor={list.sortDescriptor}
                                    onSortChange={list.sort}
                                    classNames={{
                                        table: 'min-h-[400px]',
                                    }}
                                    removeWrapper
                                    hideHeader
                                    isStriped
                                    className="mt-4"
                                >
                                    <TableHeader>
                                        <TableColumn key="name" width={'25%'} allowsSorting>
                                            #
                                        </TableColumn>
                                        <TableColumn key="height" width={'50%'} allowsSorting>
                                            Tx Hash
                                        </TableColumn>
                                        <TableColumn key="birth_year" width={'30%'} allowsSorting>
                                            Rewards
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody
                                        items={list.items}
                                        isLoading={isLoading}
                                        loadingContent={<Spinner label="Loading..." />}
                                    >
                                        {(item) => (
                                            <TableRow key={item.name}>
                                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </CardBody >
            </Card >
        </Fragment>
    )
}