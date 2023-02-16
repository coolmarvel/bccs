// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IFactory {
    function getExchange(address _tokenAddress) external returns (address);
}
