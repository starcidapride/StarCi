import { Spinner } from '@nextui-org/react'
import { Fragment } from 'react'

interface FetchSpinnerProps {
    className? : string,
    message: string,
    finishFetch?: boolean
}
export const FetchSpinner = (props: FetchSpinnerProps) => 
    <Fragment>
        {
            props.finishFetch 
                ?<div className={`gap-1 flex items-center ${props.className}`}>
                    <Spinner color="default" 
                        classNames={
                            {
                                circle1: 'w-4 h-4 border-1.5',
                                circle2: 'w-4 h-4 border-1.5',
                                wrapper: 'w-4 h-4'  
                            }
                        } /> <div className="text-xs"> {props.message} </div>
                </div>
                : null
        }
    </Fragment>
 