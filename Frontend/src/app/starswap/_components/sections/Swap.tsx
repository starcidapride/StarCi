'use client'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { Fragment } from 'react'

export const Swap = () => {
    return (
        <Fragment>
            <Card>
                <CardHeader className='font-bold p-5'> Swap </CardHeader>
                <Divider/>
                <CardBody>
                    <p>Make beautiful websites regardless of your design experience.</p>
                </CardBody>
            </Card>
        </Fragment>)
}