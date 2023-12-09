import { useState } from "react";
import {NFT_CONTRACTS, NFTS_LIST} from '../constants.js'
import { useAccount, useNetwork, useBalance, useWalletClient, usePublicClient } from 'wagmi'
import { ethers } from "ethers";
import NFTABI from '../NFTABI.json';

function Trade () {
    const {address} = useAccount()
    const {chain} = useNetwork()
    
    const[nftID, setNftID] = useState(NFTS_LIST[0]);
    const[selectedSell, setSelectedSell]= useState("NFT");
    const[selectedNFTList, setSelectedNFTList] = useState([]);
    const[showNFTsList, setShowNFTSList] = useState(false);
    const[showTokensList, setShowTokensList] = useState(false);
    const[availableNFTs, setAvailableNFTs] = useState([]);

    const loadNFTData = async () => {
        const provider = new ethers.JsonRpcProvider(NFT_CONTRACTS[chain.id].rpc);
        const nftContract = new ethers.Contract(NFT_CONTRACTS[chain.id][nftID].contractAddress, NFTABI, provider);

        const nftsList = await nftContract.getBalances(address);
        setAvailableNFTs(nftsList)

        nftsList.map(nftID => {
            console.log(nftID)
        })
    }

    return (
        <div className="flex flex-col text-white items-center justify-center w-full h-4/5">
            <div className="border border-white/5 rounded-[16px] flex flex-col items-center justify-center w-[460px] h-[400px] bg-[#304256] text-xl  space-y-8 p-3">
                {
                    selectedSell === "NFT" ?
                    <div className="w-full space-y-5"> 
                        <div className="w-full space-y-1">
                            <label className="text-sm font-semibold">You're paying</label>
                            <div className="flex justify-between bg-[#19232D] w-full h-[70px] rounded-[12px] p-4">
                                <button onClick={() => setShowNFTSList(!showNFTsList)} className="flex rounded-[10px] bg-[#304256] items-center text-sm font-semibold p-2 px-4 space-x-2">
                                    <div>{nftID}</div>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="inherit" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z" fill="inherit"></path></svg>
                                </button>
                                { showNFTsList ?
                                    <div className="rounded-lg z-10 mt-12 fixed w-[100px] h-[120px] bg-[#304256] border border-[#19232D] space-y-1 overflow-y-scroll">
                                        {
                                            NFTS_LIST.map(nft => {
                                                return(
                                                    <div onClick={() => {setNftID(nft); setShowNFTSList(false)}} className="cursor-pointer text-center text-white text-sm py-2 hover:bg-[#19232D]">
                                                        {nft}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div> : ''
                                }
                                <button onClick={() => {setShowTokensList(!showTokensList); loadNFTData()}} className="flex rounded-[10px] bg-[#304256] items-center text-sm font-semibold p-2 px-4 space-x-2">
                                    <div>Select Tokens</div>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="inherit" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z" fill="inherit"></path></svg>
                                </button>
                                {
                                    showTokensList ?
                                    <div className="rounded-lg z-10 mt-12 ml-64 fixed w-[150px] h-[120px] bg-[#304256] border border-[#19232D] space-y-1">
                                        {
                                            availableNFTs.map(nftID => {
                                                return (
                                                    <div className="cursor-pointer text-sm text-center overflow-y-scroll py-2 hover:bg-[#19232D]">Token IDs: {nftID.toString()}</div>
                                                )
                                            })
                                        }
                                    </div> : ''
                                }
                            </div>
                        </div>
                        <div class="relative flex justify-center">
                            <hr class="absolute w-full border-jupiter-input-light dark:border-[rgba(25,35,45,0.35)] top-[calc(50%-1px)] -z-0"/>
                            <div class="inline-block z-10">
                                <button onClick={() => setSelectedSell("TOKEN")} type="button" class="group/flip bg-[#19232D] dark:bg-v2-background w-8 h-8 rounded-full cursor-pointer flex flex-col justify-center border-[3px] dark:border-[rgba(25,35,45,0.75)] dark:text-white-25 dark:hover:border-v2-primary dark:hover:shadow-swap-input-dark">
                                    <span class="w-full text-white/50 fill-current flex justify-center transition-none">
                                        <svg width="21" height="22" viewBox="0 0 21 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.51043 7.47998V14.99H7.77043V7.47998L9.66043 9.36998L10.5505 8.47994L7.5859 5.51453C7.3398 5.26925 6.94114 5.26925 6.69504 5.51453L3.73047 8.47994L4.62051 9.36998L6.51043 7.47998Z" fill="currentColor"></path><path d="M14.4902 14.52V7.01001H13.2302V14.52L11.3402 12.63L10.4502 13.5201L13.4148 16.4855C13.6609 16.7308 14.0595 16.7308 14.3056 16.4855L17.2702 13.5201L16.3802 12.63L14.4902 14.52Z" fill="currentColor"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="w-full space-y-1">
                            <label className="text-sm font-semibold">To receive</label>
                            <div className="flex justify-between bg-[rgb(14,19,32,0.3)] w-full h-[70px] rounded-[12px] p-4">
                                <button className="flex rounded-[10px] bg-[#304256] items-center text-sm font-semibold p-2 px-4 space-x-2">
                                    <div>FLUID</div>
                                </button>
                                <input className="w-20 bg-[rgb(14,19,32,0.3)]" placeholder="0.00" disabled/>
                            </div>
                        </div>
                        <button className="w-full h-[70px] rounded-[14px] bg-[#121D28] hover:border hover:border-[#C7F284] text-[#C7F284] font-semibold">Swap</button>
                    </div> : 
                    <div className="w-full space-y-5"> 
                        <div className="w-full space-y-1">
                            <label className="text-sm font-semibold">You're paying</label>
                            <div className="flex justify-between bg-[#19232D] w-full h-[70px] rounded-[12px] p-4">
                                <button className="flex rounded-[10px] bg-[#304256] items-center text-sm font-semibold p-2 px-4 space-x-2">
                                    <div>FLUID</div>
                                </button>
                                <input className="w-20 bg-[#19232D]" placeholder="0.00" disabled/>
                            </div>
                        </div>
                        <div class="relative flex justify-center">
                            <hr class="absolute w-full border-jupiter-input-light dark:border-[rgba(25,35,45,0.35)] top-[calc(50%-1px)] -z-0"/>
                            <div class="inline-block z-10">
                                <button onClick={() => setSelectedSell("NFT")} type="button" class="group/flip bg-[#19232D] dark:bg-v2-background w-8 h-8 rounded-full cursor-pointer flex flex-col justify-center border-[3px] dark:border-[rgba(25,35,45,0.75)] dark:text-white-25 dark:hover:border-v2-primary dark:hover:shadow-swap-input-dark">
                                    <span class="w-full text-white/50 fill-current flex justify-center transition-none">
                                        <svg width="21" height="22" viewBox="0 0 21 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.51043 7.47998V14.99H7.77043V7.47998L9.66043 9.36998L10.5505 8.47994L7.5859 5.51453C7.3398 5.26925 6.94114 5.26925 6.69504 5.51453L3.73047 8.47994L4.62051 9.36998L6.51043 7.47998Z" fill="currentColor"></path><path d="M14.4902 14.52V7.01001H13.2302V14.52L11.3402 12.63L10.4502 13.5201L13.4148 16.4855C13.6609 16.7308 14.0595 16.7308 14.3056 16.4855L17.2702 13.5201L16.3802 12.63L14.4902 14.52Z" fill="currentColor"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="w-full space-y-1">
                            <label className="text-sm font-semibold">To receive</label>
                            <div className="flex justify-between bg-[rgb(14,19,32,0.3)] w-full h-[70px] rounded-[12px] p-4">
                                <button className="flex rounded-[10px] bg-[#304256] items-center text-sm font-semibold p-2 px-4 space-x-2">
                                    <div>{nftID}</div>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="inherit" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z" fill="inherit"></path></svg>
                                </button>
                                <input className="w-20 bg-[rgb(14,19,32,0.3)]" placeholder="0.00"/>
                            </div>
                        </div>
                        <button className="w-full h-[70px] rounded-[14px] bg-[#121D28] hover:border hover:border-[#C7F284] text-[#C7F284] font-semibold">Swap</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Trade;