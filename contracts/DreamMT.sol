// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Lib.sol";

contract DreamMT is ERC1155, Ownable {
    using SafeMath for uint256;

    string public name = "DreamMT";
    string public symbol = "DMT";
    uint256 public userCounter;
    uint256 public mtCounter;

    mapping(uint256 => Lib.MT) public mtStorage;
    mapping(uint256 => Lib.User) public userStorage;

    mapping(uint256 => string) customUri;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public tokenSupply;

    mapping(address => bool) public userExists;
    mapping(string => bool) public tokenURIExists;
    mapping(string => bool) public tokenNameExists;

    mapping(address => uint256) public rewards;
    mapping(address => uint256) public timestamps;

    constructor(string memory _uri) ERC1155(_uri) {}

    modifier creatorOnly(uint256 _id) {
        require(creators[_id] == _msgSender());
        _;
    }

    modifier ownerOnly(uint256 _id) {
        require(
            (creators[_id] == _msgSender() && balanceOf(_msgSender(), _id) > 0)
        );
        _;
    }

    function _exist(uint256 _id) public view returns (bool) {
        return creators[_id] != address(0);
    }

    function setCreator(address _to, uint256 _id) public creatorOnly(_id) {
        require(_exist(_id) && _to != address(0));

        creators[_id] = _to;
    }

    function createUser(address _user) public {
        userCounter++;
        Lib.User storage newUser = userStorage[userCounter];
        newUser.userAddress = _user;

        userStorage[userCounter].userAddress = newUser.userAddress;

        for (uint256 i = 1; i <= mtCounter; i++) {
            userStorage[userCounter].sales[i] = newUser.sales[i];
            userStorage[userCounter].salePrice[i] = newUser.salePrice[i];
        }

        userExists[_user] = true;
    }

    function setURI(string memory _newURI) public onlyOwner {
        _setURI(_newURI);
    }

    function setCustomURI(uint256 _tokenId, string memory _newURI)
        public
        creatorOnly(_tokenId)
    {
        mtStorage[_tokenId].tokenURI = _newURI;
        emit URI(_newURI, _tokenId);
    }

    function uri(uint256 _id) public view override returns (string memory) {
        require(_exist(_id));

        bytes memory customUriBytes = bytes(customUri[_id]);
        if (customUriBytes.length > 0) {
            return customUri[_id];
        } else {
            return super.uri(_id);
        }
    }

    function singleMint(
        uint256 _id,
        uint256 _quantity,
        string memory _name,
        string memory _tokenURI
    ) public virtual {
        if (!userExists[msg.sender]) {
            createUser(msg.sender);
        }

        if (creators[_id] == address(0)) {
            creators[_id] = _msgSender();
        } else {
            require(creators[_id] == _msgSender());
        }

        if (tokenNameExists[_name]) {
            require(mtStorage[_id].tokenId == _id);
            bytes memory _data;
            _mint(msg.sender, _id, _quantity, _data);
            tokenSupply[_id] = tokenSupply[_id].add(_quantity);
        } else {
            require(!tokenNameExists[_name]);
            mtCounter++;
            bytes memory _data;
            _mint(msg.sender, _id, _quantity, _data);
            tokenSupply[_id] = tokenSupply[_id].add(_quantity);

            tokenURIExists[_tokenURI] = true;
            tokenNameExists[_name] = true;

            Lib.MT memory newMT = Lib.MT(_id, _name, _tokenURI);
            mtStorage[_id] = newMT;
        }
    }

    function batchMint(
        uint256[] memory _ids,
        uint256[] memory _quantities,
        string[] memory _names,
        string[] memory _tokenURIs
    ) public virtual {
        if (!userExists[msg.sender]) {
            createUser(msg.sender);
        }

        for (uint256 i = 0; i < _ids.length; i++) {
            uint256 _id = _ids[i];
            string memory _name = _names[i];
            string memory _tokenURI = _tokenURIs[i];

            if (creators[_id] == address(0)) {
                creators[_id] = _msgSender();
            } else {
                require(creators[_id] == _msgSender());
            }

            require(!tokenNameExists[_name]);
            require(!tokenURIExists[_tokenURI]);

            tokenNameExists[_name] = true;
            tokenURIExists[_tokenURI] = true;

            uint256 _quantity = _quantities[i];
            tokenSupply[_id] = tokenSupply[_id].add(_quantity);
        }

        bytes memory _data;
        _mintBatch(msg.sender, _ids, _quantities, _data);
    }

    function singleBurn(uint256 _id, uint256 _quantity) public ownerOnly(_id) {
        tokenSupply[_id] = tokenSupply[_id].sub(_quantity);
        _burn(_msgSender(), _id, _quantity);
    }

    function batchBurn(uint256[] memory _ids, uint256[] memory _quantities)
        public
    {
        for (uint256 i = 0; i < _ids.length; i++) {
            uint256 _id = _ids[i];
            require(
                balanceOf(_msgSender(), _id) > 0 || owner() == _msgSender()
            );

            uint256 _quantity = _quantities[i];
            tokenSupply[_id] = tokenSupply[_id].sub(_quantity);
        }
        _burnBatch(msg.sender, _ids, _quantities);
    }

    function getUserId(address _address) public view returns (uint256) {
        uint256 result;
        for (uint256 i = 1; i <= userCounter; i++) {
            if (userStorage[i].userAddress == _address) {
                result = i;
            }
        }
        return result;
    }

    function toggleForSale(
        uint256 _tokenId,
        uint256 _amount,
        bool _toggle,
        address _saleContAddress // SaleDreamMT Contract Address
    ) public {
        uint256 _userId = getUserId(msg.sender);
        Lib.User storage user = userStorage[_userId];
        uint256 bal = balanceOf(msg.sender, _tokenId);
        require(bal >= _amount);
        if (_toggle) {
            user.sales[_tokenId] = user.sales[_tokenId] + _amount;
            // userStorage[_userId].userAddress = user.userAddress;

            for (uint256 i = 1; i <= mtCounter; i++) {
                userStorage[_userId].sales[i] = user.sales[i];
                userStorage[_userId].salePrice[i] = user.salePrice[i];
            }
        } else {
            require(user.sales[_tokenId] >= _amount);
            user.sales[_tokenId] = user.sales[_tokenId] - _amount;
            // userStorage[_userId].userAddress = user.userAddress;

            for (uint256 i = 1; i <= mtCounter; i++) {
                userStorage[_userId].sales[i] = user.sales[i];
                userStorage[_userId].salePrice[i] = user.salePrice[i];
            }
        }
        setApprovalForAll(_saleContAddress, true);
    }

    function getSales(address _userAddress, uint256 _id)
        public
        view
        returns (uint256)
    {
        uint256 result;
        for (uint256 i = 1; i <= userCounter; i++) {
            Lib.User storage user = userStorage[i];
            if (user.userAddress == _userAddress) {
                result = user.sales[_id];
            }
        }
        return result;
    }

    function getSalePrice(address _userAddress, uint256 _id)
        public
        view
        returns (uint256)
    {
        uint256 result;
        for (uint256 i = 1; i <= userCounter; i++) {
            Lib.User storage user = userStorage[i];
            if (user.userAddress == _userAddress) {
                result = user.salePrice[_id];
            }
        }
        return result;
    }

    function setPrice(uint256 _tokenId, uint256 _price) public {
        uint256 _userId = getUserId(msg.sender);
        Lib.User storage user = userStorage[_userId];
        user.salePrice[_tokenId] = _price;
        // userStorage[_userId].userAddress = user.userAddress;

        for (uint256 i = 1; i <= mtCounter; i++) {
            userStorage[_userId].salePrice[i] = user.salePrice[i];
            userStorage[_userId].sales[i] = user.sales[i];
        }
    }

    function buyToken(
        uint256 _tokenId,
        uint256 _amount,
        address _from,
        address _to
    ) public payable {
        require(_from != address(0) && _to != address(0) && _from != _to);

        if (!userExists[_to]) {
            createUser(_to);
        }

        uint256 _userId = getUserId(_from);
        Lib.User storage user = userStorage[_userId];
        require(user.sales[_tokenId] >= _amount);

        bytes memory data;
        safeTransferFrom(_from, _to, _tokenId, _amount, data);
        user.sales[_tokenId] = user.sales[_tokenId] - _amount;
        // userStorage[_userId].userAddress = user.userAddress;

        for (uint256 i = 1; i <= mtCounter; i++) {
            userStorage[_userId].sales[i] = user.sales[i];
            userStorage[_userId].salePrice[i] = user.salePrice[i];
        }
    }
}
