import React, { useState, useEffect } from 'react';
import { useWeb3Context } from "web3-react";
import Connectors from './Connectors'
import Button from '@material-ui/core/Button';

export default function ConnectButton(){
    const context = useWeb3Context();

    const bStyle = {
        align: 'right'
    }
    const [active, setActive] = useState(false);

    useEffect( () => {
        console.log(context)
    }, [context.active])

    function handleContextSetting(){
        
    }
    return(
        <React.Fragment>
            {context.error && (
                <p>An error occurred, check the console for details.</p>
            )}
            {(Object.keys(Connectors).map(connectorName => (
            <React.Fragment>
            <Button
            style = {bStyle}
            key={connectorName}
            disabled={context.connectorName === connectorName}
            onClick={() => {
                console.log(connectorName)
                context.setConnector(connectorName)
            }}
            variant='outlined'
            size='small'
            color='secondary'
            >
            {!context.account ? 'Connect Web3' : context.account.substring(0,3) + '...' + context.account.substring(19,22)}
            </Button>
            <br />
            <br />
            </React.Fragment>
        )))}
        </React.Fragment>
    )
}