'use client'
import { Card, CardBody, CardHeader, Divider, Input, Select, SelectItem } from '@nextui-org/react'
import { ChooseToken } from './ChooseToken'

export const AddLiquidity = () => {
    const protocolFees = [
        {
            title: '0.25%'
        },
        {
            title: '0.5%',
        },
        {
            title: '1%',
        },
        {
            title: '2.5%',
        }
    ]

    const animals = [
        {label: 'Cat', value: 'cat', description: 'The second most popular pet in the world'},
        {label: 'Dog', value: 'dog', description: 'The most popular pet in the world'},
        {label: 'Elephant', value: 'elephant', description: 'The largest land animal'},
        {label: 'Lion', value: 'lion', description: 'The king of the jungle'},
        {label: 'Tiger', value: 'tiger', description: 'The largest cat species'},
        {label: 'Giraffe', value: 'giraffe', description: 'The tallest land animal'},
        {
            label: 'Dolphin',
            value: 'dolphin',
            description: 'A widely distributed and diverse group of aquatic mammals',
        },
        {label: 'Penguin', value: 'penguin', description: 'A group of aquatic flightless birds'},
        {label: 'Zebra', value: 'zebra', description: 'A several species of African equids'},
        {
            label: 'Shark',
            value: 'shark',
            description: 'A group of elasmobranch fish characterized by a cartilaginous skeleton',
        },
        {
            label: 'Whale',
            value: 'whale',
            description: 'Diverse group of fully aquatic placental marine mammals',
        },
        {label: 'Otter', value: 'otter', description: 'A carnivorous mammal in the subfamily Lutrinae'},
        {label: 'Crocodile', value: 'crocodile', description: 'A large semiaquatic reptile'},
    ]

    const tokens = [{label: 'STARCI', value: 'starci'}, {label: 'ETH', value: 'etherum'}]
    return (
        <Card>
            <CardHeader className='font-bold p-5'> Add Liquidity </CardHeader>
            <Divider/>
            <CardBody>
                <div className="grid grid-cols-2 gap-12">
                    <div className="col-span-2 sm:col-span-1">
                        <div> 
                            <div className="text-sm font-bold text-teal-500"> Choose Token Pair </div>
                            <div className="flex items-center gap-4 mt-6">
                                <ChooseToken className = "grow"/>
                            +
                                <ChooseToken className = "grow"/>
                            </div>
                            
                        </div>
                        <div className="mt-12"> 
                            <div className="text-sm font-bold text-teal-500"> Pick Protocol Fee Tier </div>
                            <div className="flex items-center gap-4 mt-6">
                                {protocolFees.map((fee, index) => 
                                    (<Card key={index} className="flex-1" isPressable>
                                        <CardBody className="font-bold text-center">
                                            {fee.title}
                                        </CardBody>
                                    </Card>)
                                )}
                            </div>
                        </div>

                        <div className="mt-12"> 
                            <div className="text-sm font-bold text-teal-500"> Deposit Token </div>

                            <Select 
                                items={tokens}
                                label="Select Quote Token"
                                className="mt-6"
                            >
                                {(token) => <SelectItem key={token.value}>{token.label}</SelectItem>}
                            </Select>

                            <Input
                                type="number"
                                className="mt-3"
                                labelPlacement="inside"
                                label="Amount"
                                variant="bordered"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">STARCI</span>
                                    </div>
                                } />
                        </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        23
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}