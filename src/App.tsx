import './App.css'
import {TonConnectButton} from "@tonconnect/ui-react";
import {useMainContract} from "./hooks/useMainContract.ts";
import {useTonConnect} from "./hooks/useTonConnect.ts";
import {fromNano} from "ton-core";

function App() {
    const {
        contract_address,
        counter_value,
        recent_sender,
        owner_address,
        contract_balance,
        sendIncrement,
        sendDeposit,
        sendWithdrawalRequest
    } = useMainContract();

    const { connected } = useTonConnect();
    return (
        <div>
            <div className='App'>
                <TonConnectButton/>
            </div>
            <div>
                <div className='Card'>
                    <b>Our contract Address</b>
                    <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
                    <b>Our contract Balance</b>
                    { contract_balance && <div className='Hint'>{fromNano(contract_balance)}</div>}
                </div>

                <div className='Card'>
                    <b>Counter Value</b>
                    <div>{counter_value ?? "Loading..."}</div>
                </div>
                {connected && (
                  <a onClick={()=>{
                      sendIncrement()
                  }}>Increment by 5</a>
                )}
                <br/>
                {connected && (
                    <a onClick={()=>{
                        sendDeposit()
                    }}>Request Deposit to 1 ton</a>
                )}
                <br/>
                {connected && (
                    <a onClick={()=>{
                        sendWithdrawalRequest();
                    }}>Request 0.7 ton withdrawal</a>
                )}
            </div>
        </div>
    )
}

export default App
