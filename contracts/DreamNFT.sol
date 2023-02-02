// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Lib.sol";
import "./DreamToken.sol";

contract DreamNFT is
    ERC721URIStorage,
    ERC721Enumerable,
    ReentrancyGuard,
    Ownable
{
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    address payable private immutable _owner;

    DreamToken private dreamToken;

    constructor(address _tokenAddress) ERC721("DreamNFT", "DNT") {
        _owner = payable(msg.sender);
        dreamToken = DreamToken(_tokenAddress);
    }

    mapping(string => bool) private existCID;
    mapping(address => bool) private mintAuthority;
    mapping(uint256 => Lib.NFT) private nftStorage;

    /* URIStorage & Enumerable 충돌 override */
    function _burn(
        uint256 _tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _baseURI() internal pure override(ERC721) returns (string memory) {
        return "https://dreamsecurity.infura-ipfs.io/ipfs/";
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return string(abi.encodePacked(super.tokenURI(tokenId)));
    }

    /* URIStorage & Enumerable 충돌 override */

    modifier mintAuth(address _address) {
        require(
            msg.sender == owner() || mintAuthority[_address] == true,
            "you don't have mint authority"
        );
        _;
    }

    // 민팅 권한 추가
    function setAuthority(address _address) public {
        mintAuthority[_address] = true;
    }

    // 민팅 권한 제거
    function banAuthority(address _address) public {
        mintAuthority[_address] = false;
    }

    // 민팅 권한 유무 확인
    function getAuthority(address _address) external view returns (bool) {
        return mintAuthority[_address];
    }

    // tokenOwner 조회
    function getOwner(uint256 _tokenId) public view returns (address) {
        return nftStorage[_tokenId].owner;
    }

    // NFT mint
    function mintNFT(string memory _metaDataCID) external mintAuth(msg.sender) {
        require(existCID[_metaDataCID] == false, "metaDataCID is repeated");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _metaDataCID);
        existCID[_metaDataCID] = true;

        Lib.NFT memory newNFT = Lib.NFT(
            newTokenId,
            _metaDataCID,
            msg.sender,
            0,
            false
        );

        nftStorage[newTokenId] = newNFT;
    }

    // NFT transfer
    function transferNFT(uint256 _tokenId, address _to) external {
        address _nftOwner = nftStorage[_tokenId].owner;
        require(
            msg.sender == owner() || msg.sender == _nftOwner,
            "you don't have transfer nft"
        );
        transferFrom(_nftOwner, _to, _tokenId);
        nftStorage[_tokenId].owner = _to;
    }

    // burn NFT
    function burnNFT(uint256 _tokenId) external onlyOwner {
        _burn(_tokenId);

        delete nftStorage[_tokenId];
    }

    // 가지고 있는 토큰아이디들 조회
    function myNFTLists() public view returns (Lib.NFT[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (nftStorage[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        Lib.NFT[] memory items = new Lib.NFT[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (nftStorage[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                Lib.NFT storage currentItem = nftStorage[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // 총 발행된 NFT 수량 조회
    function totalNFTs() public view returns (uint256) {
        return _tokenIds.current();
    }

    // 계정의 보유중인 tokenIds 조회
    function getTokenIds(
        address _address
    ) external view returns (uint256[] memory) {
        uint256 balanceLength = balanceOf(_address);
        uint256[] memory tokenIds = new uint256[](balanceLength);

        for (uint256 i = 0; i < balanceLength; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(_address, i);
            tokenIds[i] = tokenId;
        }

        return tokenIds;
    }

    // tokenIds로 NFT 정보 조회
    function getNftsInfo(
        uint256[] memory tokenIds
    ) external view returns (Lib.NFT[] memory) {
        Lib.NFT[] memory nfts = new Lib.NFT[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            nfts[i] = nftStorage[tokenIds[i]];
        }

        return nfts;
    }

    // dreamToken으로 NFT 민팅
    function mintNFTwithDreamToken(
        string memory _metaDataCID,
        uint8 _price
    ) external mintAuth(msg.sender) {
        require(dreamToken.balanceOf(msg.sender) > _price);

        dreamToken.transferFrom(msg.sender, owner(), _price);

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _metaDataCID);

        Lib.NFT memory newNFT = Lib.NFT(
            newTokenId,
            _metaDataCID,
            payable(msg.sender),
            _price,
            false
        );

        nftStorage[newTokenId] = newNFT;
    }
}
