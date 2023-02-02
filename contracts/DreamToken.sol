// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DreamToken is ERC20, Ownable, Pausable {
    using SafeMath for uint256;

    uint256 private _totalSupply;
    address private immutable _owner;
    uint256 private initialSupply = 1000000000 * (10 ** uint256(decimals()));

    constructor() ERC20("DreamToken", "DTK") {
        _owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    // freeze
    event Frozen(address target);
    event Unfrozen(address target);

    mapping(address => bool) freezes;

    modifier whenNotFrozen() {
        require(!freezes[msg.sender], "From Account is locked.");
        _;
    }

    function getMsgSender() public view returns (address) {
        return _msgSender();
    }

    function mint(address _to, uint256 _value) public onlyOwner returns (bool) {
        _mint(_to, _value);

        return true;
    }

    function burn(address _address, uint256 _value) public onlyOwner {
        require(_value <= balanceOf(_address), "Balance is too small.");

        _burn(_address, _value);
    }

    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }

    function currentTime() public view returns (uint256) {
        return block.timestamp;
    }

    function afterTime(uint256 _value) public view returns (uint256) {
        return block.timestamp + _value;
    }

    function transfer(
        address to,
        uint256 amount
    ) public override whenNotPaused whenNotFrozen returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override whenNotPaused whenNotFrozen returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function freeze(address _address) public onlyOwner {
        freezes[_address] = true;
        emit Frozen(_address);
    }

    function unfreeze(address _address) public onlyOwner {
        freezes[_address] = false;
        emit Unfrozen(_address);
    }

    function isFrozen(address _address) public view returns (bool) {
        return freezes[_address];
    }
}
