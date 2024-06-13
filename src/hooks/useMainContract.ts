import {useEffect, useState} from "react";
import { MainContract} from "../contracts/MainContract.ts";
import { useTonClient} from "./useTonClient.ts";
import { useAsyncInitialize} from "./useAsyncInitialize.ts";
import {Address, OpenedContract, toNano} from "ton-core";
import {useTonConnect} from "./useTonConnect.ts";
// Contract page
// https://testnet.tonscan.org/address/EQAhK1r7NhhCd-u3tfCYfACuKlnmno0v7nxn_Yy1rJgcqLXY

export function useMainContract() {
    const client = useTonClient();
    console.log('Client', client);
    const {sender} = useTonConnect();
    console.log('Sender', sender);
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const [balance, setBalance] = useState<null | number>(null)
    const [contractData, setContractData] = useState< null | {
        counter_value: number;
        recent_sender: Address;
        owner_address: Address;
    }>();
    const mainContract = useAsyncInitialize( async () => {
        console.log('Client', client);
       if (!client) return;
        const contract = new MainContract(
            Address.parse("EQAhK1r7NhhCd-u3tfCYfACuKlnmno0v7nxn_Yy1rJgcqLXY")
            // Address.parse("0QAFhx_kPbsNZkkS7Qj5bN6RnQqoZMFQHH0zoUtuN5nUXGgp")
        );
        console.log('Contract', contract);
        return client.open(contract) as OpenedContract<MainContract>;
    });

    useEffect(()=>{
        async function getValue(){
            if (!mainContract) return;
            setContractData(null);
            const val = await mainContract.getData();
            const {balance} = await mainContract.getBalance();
            setContractData({
                counter_value: val.number,
                recent_sender: val.recent_sender,
                owner_address: val.owner_address
            });
            setBalance(balance);
            await sleep(5000);
        }
        getValue();
    }, [mainContract]);
    return{
        contract_address: mainContract?.address.toString(),
        contract_balance: balance,
        ...contractData,
        sendIncrement: async () => {
            return mainContract?.sendIncrementMessage(sender, toNano("0.05"), 5)
        },
        sendDeposit: async () => {
            return mainContract?.sendDeposit(sender, toNano("1"));
        },
        sendWithdrawalRequest: async () => {
            return mainContract?.sendWithdrawalRequest(sender, toNano("0.05"), toNano("0.7"));
        }
    };

}
