// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Bayc is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 MAX_SUPPLY = 10000;
    string constant public baseURI = 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';

    mapping(address => uint256[]) balances;

    constructor() ERC721("Bayc", "BAYC") {
    }

    function safeMint() public {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId <= MAX_SUPPLY, "Sorry, all NFTs have been minted!");
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    function getBalances(address adr) view external returns(uint256[] memory){
        return balances[adr];
    }

    function tokenURI(uint256 tokenId)
        public
        pure
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return string.concat(baseURI, Strings.toString(tokenId));
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721, ERC721Enumerable) returns (address prevOwner) {
        address prevOwner = super._update(to,tokenId,auth);

        if(to != address(0)) {
            balances[to].push(tokenId);
        }

        if(prevOwner != address (0)) {
            for(uint i; i < balances[prevOwner].length;) {
                if(balances[prevOwner][i] == tokenId) {
                    balances[prevOwner][i] = balances[prevOwner][balances[prevOwner].length - 1];
                    balances[prevOwner].pop();
                    break;
                }
            
                unchecked {
                    i++;
                }
            }
        }
        return prevOwner;
    }

    function _increaseBalance(address account, uint128 value) internal virtual override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account,value);
    }
}
