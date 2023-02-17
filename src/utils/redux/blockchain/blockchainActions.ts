import { ethers } from 'ethers';
import abi from '../contractInfo/abi.json';
import CONTRACT from '../contractInfo/contractInfo.json';
import { setLoading, setConnectedAccount, failedConnection } from './blockchainReducer';

declare let window: any

export const connect = async () => {
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
        try {
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            checkNetwork()

            const contract = getContract();

            return {
                account: accounts[0],
                contract: contract,
                error: ""
            }
        } catch (err) {
            return { error: "Install Metamask." }
        }
    } else {
        return { error: "Install Metamask." }
    }
};

export const getContract =async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT.address, abi, signer);

    return contract
};

export const checkNetwork = async () => {
    const { ethereum } = window;

    const network = await ethereum.request({
        method: 'net_version',
    });

    if (network !== CONTRACT.chainId) {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CONTRACT.chainId }],
        });
    };
};

export const updateAccount = (account: any, contr: any) => {
    async (dispatch: any) => dispatch(setConnectedAccount({ account: account, smartContract: contr }));
    ;

};






