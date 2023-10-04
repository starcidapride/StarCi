import { Fragment } from 'react'

const RootLayout = ({
    children,
}: {
    children: React.ReactNode
}) => (
    <Fragment>
        {children}
    </Fragment>
)

export default RootLayout
