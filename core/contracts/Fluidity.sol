// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./LpERC20.sol";

contract Fluidity {

    address public fluidAddress;
    mapping(address => mapping(address => LPData)) lpBalances;
    mapping(address => address) nftLPContracts;
    mapping(address => uint256[]) public nftTokenIds;

    struct LPData {
        uint256 tokenBalance;
        uint256 NFTBalance;
        address lpTokenAddress;
    }

    constructor(address _fluidAddress) {
        fluidAddress = _fluidAddress;
    }

    function addLiquidity(address nftContract, uint256[] calldata tokenIds, uint256 amountFluidTokens) external {
        if(IERC721(nftContract).balanceOf(msg.sender) < tokenIds.length) {
            revert("Insufficient NFT balance");
        }

        if(IERC20(fluidAddress).balanceOf(msg.sender) < amountFluidTokens) {
            revert("Insufficient token balance");
        }

        uint length = tokenIds.length;

        LPData storage tokenBalances = lpBalances[msg.sender][nftContract];

        for(uint i; i < length; ) {

            IERC721(nftContract).transferFrom(msg.sender, address(this), tokenIds[i]);
            nftTokenIds[nftContract].push(tokenIds[i]);
            unchecked {
                i++;
            }
        }

        IERC20(fluidAddress).transferFrom(msg.sender, address(this), amountFluidTokens);

        tokenBalances.NFTBalance += length;
        tokenBalances.tokenBalance += amountFluidTokens;

        if(nftLPContracts[nftContract] == address(0)) {
            string memory lpName = string.concat('FLUID-',ERC721(nftContract).name());
            nftLPContracts[nftContract] = address(new LpERC20(lpName,lpName));
        }

        tokenBalances.lpTokenAddress = nftLPContracts[nftContract];
        LpERC20(tokenBalances.lpTokenAddress).mint(msg.sender, length * amountFluidTokens);
    }

    function removeLiquidity(address nftContract, uint256 amountFluidTokens) external {
        LPData storage tokenBalances = lpBalances[msg.sender][nftContract];
        
        uint256 noOfNfts = tokenBalances.NFTBalance;
        if(tokenBalances.tokenBalance < amountFluidTokens || noOfNfts > nftTokenIds[nftContract].length) {
            revert("Insufficiend Balances");
        }

        if(IERC20(address(this)).balanceOf(msg.sender) < (noOfNfts * amountFluidTokens)) {
            revert("Insufficient LP Balance");
        }

        for(uint i; i < noOfNfts;) {
            tokenBalances.NFTBalance -= 1;
            IERC721(nftContract).transferFrom(address(this), msg.sender, nftTokenIds[nftContract][i]);

            unchecked {
                i++;
            }
        }

        for(uint i; i < noOfNfts;) {
            nftTokenIds[nftContract][i] = nftTokenIds[nftContract][noOfNfts - 1];
            nftTokenIds[nftContract].pop();

            unchecked {
                i++;
            }
        }

        IERC20(fluidAddress).transfer(msg.sender, amountFluidTokens);
        tokenBalances.tokenBalance -= amountFluidTokens;

        LpERC20(tokenBalances.lpTokenAddress).burn(msg.sender, (noOfNfts * amountFluidTokens));
    }

    function estimateSwapNFT(address nftContract, uint256[] calldata tokenIds) external view returns(uint256){
        uint256 contractNFTBalance = IERC721(nftContract).balanceOf(address(this));
        uint256 contractTokenBalance = IERC20(fluidAddress).balanceOf(address(this));

        uint amountTokenReceived = (contractTokenBalance * tokenIds.length) / (contractNFTBalance + tokenIds.length);
        
        return amountTokenReceived;
    }

    function swapNFT(address nftContract, uint256[] calldata tokenIds) external {
        uint256 contractNFTBalance = IERC721(nftContract).balanceOf(address(this));
        uint256 contractTokenBalance = IERC20(fluidAddress).balanceOf(address(this));

        uint amountTokenReceive = (contractTokenBalance * tokenIds.length) / (contractNFTBalance + tokenIds.length);

        if(amountTokenReceive > 0 && IERC20(fluidAddress).balanceOf(address(this)) > amountTokenReceive) {
            for(uint i; i < tokenIds.length; ) {
                IERC721(nftContract).transferFrom(msg.sender, address(this), tokenIds[i]);
                nftTokenIds[nftContract].push(tokenIds[i]);
                unchecked {
                    i++;
                }
            }
            IERC20(fluidAddress).transfer(msg.sender, amountTokenReceive);
        }
    }
    
    function quoteSwapToken(address nftContract, uint amountFluidTokens) external view returns(uint) {
        uint256 contractNFTBalance = IERC721(nftContract).balanceOf(address(this));
        uint256 contractTokenBalance = IERC20(fluidAddress).balanceOf(address(this));

        uint amountNFTReceived = ((contractNFTBalance * amountFluidTokens) / (contractTokenBalance + amountFluidTokens));

        return amountNFTReceived;
    }

    function swapToken(address nftContract, uint amountFluidTokens) external {
        uint256 contractNFTBalance = IERC721(nftContract).balanceOf(address(this));
        uint256 contractTokenBalance = IERC20(fluidAddress).balanceOf(address(this));

        uint amountNFTReceived = ((contractNFTBalance * amountFluidTokens) / (contractTokenBalance + amountFluidTokens));

        IERC20(fluidAddress).transferFrom(msg.sender, address(this), amountFluidTokens);

        if(amountNFTReceived > 0) {
            if(IERC721(nftContract).balanceOf(address(this)) >= amountNFTReceived) {
                for(uint i; i < amountNFTReceived;) {

                    IERC721(nftContract).transferFrom(address(this), msg.sender, nftTokenIds[nftContract][i]);
                    
                    unchecked {
                        i++;
                    }
                }

                for(uint i; i < amountNFTReceived;) {
                    nftTokenIds[nftContract][i] = nftTokenIds[nftContract][amountNFTReceived - 1];
                    nftTokenIds[nftContract].pop();
                    unchecked {
                        i++;
                    }
                }
            }
        }
    }
}
