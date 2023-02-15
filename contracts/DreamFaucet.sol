// SPDX-License-Identifier: GPL
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    address payable owner;
    IERC20 public token;

    uint256 public withdrawalAmount = 50 * (10 ** 18);
    uint256 public lockTime = 1 minutes;

    event Withdrawal(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    mapping(address => uint256) nextAccessTime;

    constructor(address _tokenAddress) payable {
        token = IERC20(_tokenAddress);
        owner = payable(_msgSender());
    }

    receive() external payable {
        emit Deposit(_msgSender(), msg.value);
    }

    function requestTokens() public {
        require(_msgSender() != address(0));
        require(token.balanceOf(address(this)) >= withdrawalAmount);
        require(block.timestamp >= nextAccessTime[_msgSender()]);

        nextAccessTime[_msgSender()] = block.timestamp + lockTime;
        token.transfer(_msgSender(), withdrawalAmount);
    }

    function getBalance() external veiw returns (uint256) {
        return token.balanceOf(address(this));
    }

    function setWithdrawalAmount(uint256 _amount) public onlyOwner {
        withdrawalAmount = _amount * (10 ** 18);
    }

    function setLockTime(uint256 _amount) public onlyOwner {
        lockTime = _amount * 1 minutes;
    }

    function withdraw() external onlyOwner {
        emit Withdrawal(_msgSender(), token.balanceOf(address(this)));
        token.transfer(_msgSender(), token.balanceOf(address));
    }
}
