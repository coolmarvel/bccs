// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

library Lib {
    /* NFT 구조체 */
    struct NFT {
        uint256 tokenId;
        string tokenURI;
        address owner;
        uint8 price;
        bool sellState;
    }

    struct MintAuth {
        bool authority;
    }

    struct MT {
        uint256 tokenId;
        string tokenName;
        string tokenURI;
    }

    struct User {
        address userAddress;
        mapping(uint256 => uint256) sales;
        mapping(uint256 => uint256) salePrice;
    }
}
