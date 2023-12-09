import {NFT_CONTRACTS, NFTS_LIST} from '../constants.js'
import { useAccount, useNetwork, useBalance, useWalletClient, usePublicClient } from 'wagmi'
import { ethers } from "ethers";
import NFTABI from '../NFTABI.json';
import FluidERC20ABI from '../FluidERC20ABI.json';

function Faucet () {
    const {address} = useAccount()
    const {chain} = useNetwork()

    const { data: signer } = useWalletClient();

    const mintNFT = async (nftContractAddr) => {
        const provider = new ethers.JsonRpcProvider(NFT_CONTRACTS[chain.id].rpc);
        const nftContract = new ethers.Contract(nftContractAddr, NFTABI, provider);

        const signedNFTContract = nftContract.connect(signer)

        try {
            await signedNFTContract.safeMint();
        } catch (e) {

        }
    }

    const mintFluid = async () => {
        const provider = new ethers.JsonRpcProvider(NFT_CONTRACTS[chain.id].rpc);
        const fluidContract = new ethers.Contract(NFT_CONTRACTS[chain.id].fluidAddress, FluidERC20ABI, provider);

        const signedfluidContract = fluidContract.connect(signer)

        try {
            await signedfluidContract.mint(ethers.parseUnits("10","ether"));
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="flex flex-col text-white items-center justify-center w-full h-4/5">
            <div className="border border-white/5 rounded-[16px] flex flex-col items-center justify-center w-[460px] h-[400px] bg-[#304256] text-xl  space-y-8">
                <div className='space-y-8'>
                {
                    NFTS_LIST.map(nft => {
                        return (
                            <div className="flex justify-between items-center w-[400px]">
                                <div>Mint 1 {nft}</div>
                                <button onClick={() => mintNFT(NFT_CONTRACTS[chain.id][nft].contractAddress)} className='rounded-lg hover:border hover:border-[#C7F284] bg-[#121D28] text-[#C7F284] p-4 px-16'>Mint</button>
                            </div>
                        )
                    })
                }
                </div>
                <div className="flex justify-between items-center w-[400px]">
                    <div>Mint 10 $Fluid Tokens</div>
                    <button onClick={() => mintFluid()} className='rounded-lg hover:border hover:border-[#C7F284] bg-[#121D28] text-[#C7F284] p-4 px-16'>Mint</button>
                </div>
            </div>
        </div>
    )
}

export default Faucet;