// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./DreamMT.sol";
import "./Lib.sol";

contract SaleDreamMT is Ownable {
    DreamMT public dreamMTContract;

    constructor(DreamMT _dreamMTContract) {
        dreamMTContract = _dreamMTContract;
    }

    function buyMT(
        uint256 _tokenId,
        uint256 _amount,
        address _from
    ) public payable {
        dreamMTContract.buyToken(_tokenId, _amount, _from, msg.sender);
    }

    function giftMT(
        uint256 _tokenId,
        uint256 _amount,
        address _to
    ) public payable {
        dreamMTContract.buyToken(_tokenId, _amount, msg.sender, _to);
    }
}
