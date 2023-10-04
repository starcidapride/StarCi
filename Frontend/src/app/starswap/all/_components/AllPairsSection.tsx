import { TableHeader, Table, TableColumn, TableCell, TableRow, TableBody, Pagination, Card, CardBody } from '@nextui-org/react'
import { useEffect, useMemo, useState } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'

import { ScopeReference } from '@app/_components/Commons'
import { useRouter } from 'next/navigation'
import { getAllLiquidityPools, getProps, getSymbol } from '@web3'
import { RootState } from '@redux'
import { Address } from 'web3'

interface AllPairsSectionProps{
    className?: string
}

export const AllPairsSection = (props: AllPairsSectionProps) => {
    const router = useRouter()
    const chainName = useSelector((state: RootState) => state.chainName.chainName)
    
    const handleSelectTokenSubmit = (values: {
        tokenAddress: string
    }, isToken0: boolean) => {
        formik.setFieldValue(isToken0 ? 'token0' : 'token1', values.tokenAddress)
    }

    const formik = useFormik({
        initialValues: {
            token0: '',
            token1: '',
        },

        validationSchema: Yup.object({
            token0: Yup.string()
                .required('This field is required'),
            token1: Yup.string()
                .required('This field is required'),
        }),
        onSubmit: values => {}
    })

    const [page, setPage] = useState(1)
    const rowsPerPage = 4

    const [allPairs, setAllPairs] = useState<ReadableLiquidityPoolProps[] | null>(null) 
    
    const [finishLoad, setFinishLoad] = useState(false)

    const pages = Math.ceil(users.length / rowsPerPage)

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return users.slice(start, end)
    }, [page, users])

    useEffect(() => {
        const handleEffect = async () => {
            const _allPairs: ReadableLiquidityPoolProps[] = []
            
            const _allLiquidiyPools = await getAllLiquidityPools(chainName)

            if (_allLiquidiyPools == null) return 

            for (const address of _allLiquidiyPools){
                const _props = await getProps(
                    chainName,
                    address
                )
                console.log(_props)
                if (_props == null) return

                const token0Symbol = await getSymbol(chainName, _props.token0)
                if (token0Symbol == null) return
                
                const token1Symbol = await getSymbol(chainName, _props.token1)
                if (token1Symbol == null) return

                _allPairs.push({
                    poolAddress: address,
                    token0Symbol,
                    token1Symbol,
                    token0Locked:_props.token0Locked,
                    token1Locked:_props.token1Locked
                })
            }

            setAllPairs(_allPairs)
            
            setFinishLoad(true)
        }   
        handleEffect()
    }, [])

    return (
        <Card>
            <CardBody>
                <div> 
                    {/* <div className="flex justify-between gap-3">
                        <Input
                            isClearable
                            variant="bordered"
                            className="max-w-[250px]"
                            placeholder="Type anything to search..."
                            startContent={
                                <MagnifyingGlassIcon height={16} width={16} />
                            }
                        />
                        <div className="flex items-center gap-4">
                            <ChooseToken
                                chainName={chainName}
                                className="grow"
                                tokenAddress={formik.values.token0}
                                otherTokenAddress={formik.values.token1}
                                handleSubmit={values => handleSelectTokenSubmit(values, true)} />
                            <PlusIcon height={24} width={24} />
                            <ChooseToken
                                chainName={chainName}
                                className="grow"
                                tokenAddress={formik.values.token1}
                                otherTokenAddress={formik.values.token0}
                                handleSubmit={values => handleSelectTokenSubmit(values, true)} />
                        </div>
                    </div> */}

                    <Table     
                        className="mt-1"
                        selectionMode="single" 
                        removeWrapper
                        aria-label="Example table with client side pagination"
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    classNames={
                                        {
                                            cursor: 'bg-teal-500'
                                        }
                                    }
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        }
                        classNames={{
                            wrapper: 'min-h-[222px]',
                            th: ['bg-transparent', 'text-teal-500', 'border-b', 'border-divider'],
                        }}
                    >
                        <TableHeader>   
                            <TableColumn width={'17.5%'} key="address">ADDRESS</TableColumn>
                            <TableColumn width={'30%'} key="pair">PAIR</TableColumn>
                            <TableColumn width={'17.5%'} key="liquidity">LIQUIDITY</TableColumn>
                            <TableColumn width={'17.5%'} key="token0Locked">TOKEN 0 LOCKED</TableColumn>
                            <TableColumn width={'17.5%'} key="token1Locked">TOKEN 1 LOCKED</TableColumn>
                        </TableHeader>
                        <TableBody items={allPairs ?? []} className="w-full">
                            {pair => (
                                <TableRow key={pair.poolAddress} onClick={() => router.push(`/starswap/${pair.poolAddress}`)}>
                                    <TableCell width={'17.5%'} key="address"><ScopeReference className='font-bold text-sm' address={pair.poolAddress} /></TableCell>
                                    <TableCell width={'30%'} key="pair">{`${pair.token0Symbol} + ${pair.token1Symbol}`}</TableCell>
                                    <TableCell width={'17.5%'} key="liquidity">LIQUIDITY</TableCell>
                                    <TableCell width={'17.5%'} key="token0Locked">{pair.token0Locked}</TableCell>
                                    <TableCell width={'17.5%'} key="token1Locked">{pair.token1Locked}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardBody>
        </Card>



        
    )
}

export type ReadableLiquidityPoolProps = {
    poolAddress: Address
    token0Symbol: string
    token1Symbol: string
    token0Locked: string
    token1Locked: string 
}

const users = [
    {
        key: '1',
        name: 'Tony Reichert',
        role: 'CEO',
        status: 'Active',
    },
    {
        key: '2',
        name: 'Zoey Lang',
        role: 'Technical Lead',
        status: 'Paused',
    },
    {
        key: '3',
        name: 'Jane Fisher',
        role: 'Senior Developer',
        status: 'Active',
    },
    {
        key: '4',
        name: 'William Howard',
        role: 'Community Manager',
        status: 'Vacation',
    },
    {
        key: '5',
        name: 'Emily Collins',
        role: 'Marketing Manager',
        status: 'Active',
    },
    {
        key: '6',
        name: 'Brian Kim',
        role: 'Product Manager',
        status: 'Active',
    },
    {
        key: '7',
        name: 'Laura Thompson',
        role: 'UX Designer 123 21e à aSF À DFS',
        status: 'Active',
    },
    {
        key: '8',
        name: 'Michael Stevens',
        role: 'Data Analyst',
        status: 'Paused',
    },
    {
        key: '9',
        name: 'Sophia Nguyen',
        role: 'Quality Assurance',
        status: 'Active',
    },
    {
        key: '10',
        name: 'James Wilson',
        role: 'Front-end Developer',
        status: 'Vacation',
    },
    {
        key: '11',
        name: 'Ava Johnson',
        role: 'Back-end Developer',
        status: 'Active',
    },
    {
        key: '12',
        name: 'Isabella Smith',
        role: 'Graphic Designer',
        status: 'Active',
    },
    {
        key: '13',
        name: 'Oliver Brown',
        role: 'Content Writer',
        status: 'Paused',
    },
    {
        key: '14',
        name: 'Lucas Jones',
        role: 'Project Manager',
        status: 'Active',
    },
    {
        key: '15',
        name: 'Grace Davis',
        role: 'HR Manager',
        status: 'Active',
    },
    {
        key: '16',
        name: 'Elijah Garcia',
        role: 'Network Administrator',
        status: 'Active',
    },
    {
        key: '17',
        name: 'Emma Martinez',
        role: 'Accountant',
        status: 'Vacation',
    },
    {
        key: '18',
        name: 'Benjamin Lee',
        role: 'Operations Manager',
        status: 'Active',
    },
    {
        key: '19',
        name: 'Mia Hernandez',
        role: 'Sales Manager',
        status: 'Paused',
    },
    {
        key: '20',
        name: 'Daniel Lewis',
        role: 'DevOps Engineer',
        status: 'Active',
    },
    {
        key: '21',
        name: 'Amelia Clark',
        role: 'Social Media Specialist',
        status: 'Active',
    },
    {
        key: '22',
        name: 'Jackson Walker',
        role: 'Customer Support',
        status: 'Active',
    },
    {
        key: '23',
        name: 'Henry Hall',
        role: 'Security Analyst',
        status: 'Active',
    },
    {
        key: '24',
        name: 'Charlotte Young',
        role: 'PR Specialist',
        status: 'Paused',
    },
    {
        key: '25',
        name: 'Liam King',
        role: 'Mobile App Developer',
        status: 'Active',
    },
]