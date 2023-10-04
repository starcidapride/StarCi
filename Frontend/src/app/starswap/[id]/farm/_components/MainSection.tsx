import { ArrowRightOnRectangleIcon, ArrowsRightLeftIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Button, ButtonGroup, Card, CardBody, CardHeader, Divider, Input, Spinner, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, getKeyValue } from '@nextui-org/react'
import { useState } from 'react'
import { Address } from 'web3'
import { useAsyncList } from '@react-stately/data'

interface FarmSectionProps {
    className?: string,
    poolAddress: Address
}

export const MainSection = (props: FarmSectionProps) => {
    const [isLoading, setIsLoading] = useState(true)

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
        <Card className="max-w-[400px] m-auto">
            <CardHeader className="p-5 font-bold"> Farm </CardHeader>
            <Divider />
            <CardBody>
                <div>
                    <div className="text-sm font-bold text-teal-500"> LP Token Holding </div>
                    <div className="mt-6">
                        <div className="flex gap-3 items-end">
                            <div className="text-3xl -bold"> 500 LP </div>
                            <div> (50%) </div>
                        </div>

                        <div className="flex gap-3 mt-4 ">
                            <Button variant="flat"
                                isIconOnly
                                className="rounded-full"
                                endContent={<PlusIcon height={24} width={24} />}
                            />
                            <Button variant="flat"
                                isIconOnly
                                className="rounded-full"
                                endContent={<ArrowRightOnRectangleIcon height={24} width={24} />}
                            />
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="text-sm font-bold text-teal-500"> Logs </div>

                        <div className="mt-6 ">
                            <Tabs variant="underlined">
                                <Tab key="photos" title="Farming" />
                                <Tab key="music" title="Deposit" />
                                <Tab key="videos" title="Withdraw" />
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
            </CardBody>
        </Card >
    )
}