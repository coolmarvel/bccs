const kip7bytecode =
  "0x60806040523480156200001157600080fd5b50604051620021bb380380620021bb8339818101604052810190620000379190620001f6565b8160039081620000489190620004c6565b5080600490816200005a9190620004c6565b505050620005ad565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000cc8262000081565b810181811067ffffffffffffffff82111715620000ee57620000ed62000092565b5b80604052505050565b60006200010362000063565b9050620001118282620000c1565b919050565b600067ffffffffffffffff82111562000134576200013362000092565b5b6200013f8262000081565b9050602081019050919050565b60005b838110156200016c5780820151818401526020810190506200014f565b60008484015250505050565b60006200018f620001898462000116565b620000f7565b905082815260208101848484011115620001ae57620001ad6200007c565b5b620001bb8482856200014c565b509392505050565b600082601f830112620001db57620001da62000077565b5b8151620001ed84826020860162000178565b91505092915050565b6000806040838503121562000210576200020f6200006d565b5b600083015167ffffffffffffffff81111562000231576200023062000072565b5b6200023f85828601620001c3565b925050602083015167ffffffffffffffff81111562000263576200026262000072565b5b6200027185828601620001c3565b9150509250929050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002ce57607f821691505b602082108103620002e457620002e362000286565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200034e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200030f565b6200035a86836200030f565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003a7620003a16200039b8462000372565b6200037c565b62000372565b9050919050565b6000819050919050565b620003c38362000386565b620003db620003d282620003ae565b8484546200031c565b825550505050565b600090565b620003f2620003e3565b620003ff818484620003b8565b505050565b5b8181101562000427576200041b600082620003e8565b60018101905062000405565b5050565b601f82111562000476576200044081620002ea565b6200044b84620002ff565b810160208510156200045b578190505b620004736200046a85620002ff565b83018262000404565b50505b505050565b600082821c905092915050565b60006200049b600019846008026200047b565b1980831691505092915050565b6000620004b6838362000488565b9150826002028217905092915050565b620004d1826200027b565b67ffffffffffffffff811115620004ed57620004ec62000092565b5b620004f98254620002b5565b620005068282856200042b565b600060209050601f8311600181146200053e576000841562000529578287015190505b620005358582620004a8565b865550620005a5565b601f1984166200054e86620002ea565b60005b82811015620005785784890151825560018201915060208501945060208101905062000551565b8683101562000598578489015162000594601f89168262000488565b8355505b6001600288020188555050505b505050505050565b611bfe80620005bd6000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c806342842e0e11610097578063a9059cbb11610066578063a9059cbb146102d5578063b88d4fde14610305578063dd62ed3e14610321578063eb7955491461035157610100565b806342842e0e1461023b57806370a082311461025757806395d89b4114610287578063a457c2d7146102a557610100565b806323b872dd116100d357806323b872dd146101a1578063313ce567146101d157806339509351146101ef578063423f6cef1461021f57610100565b806301ffc9a71461010557806306fdde0314610135578063095ea7b31461015357806318160ddd14610183575b600080fd5b61011f600480360381019061011a9190610fe6565b61036d565b60405161012c919061102e565b60405180910390f35b61013d61044f565b60405161014a91906110d9565b60405180910390f35b61016d6004803603810190610168919061118f565b6104e1565b60405161017a919061102e565b60405180910390f35b61018b610504565b60405161019891906111de565b60405180910390f35b6101bb60048036038101906101b691906111f9565b61050e565b6040516101c8919061102e565b60405180910390f35b6101d961053d565b6040516101e69190611268565b60405180910390f35b6102096004803603810190610204919061118f565b610546565b604051610216919061102e565b60405180910390f35b6102396004803603810190610234919061118f565b61057d565b005b610255600480360381019061025091906111f9565b6105a9565b005b610271600480360381019061026c9190611283565b6105e1565b60405161027e91906111de565b60405180910390f35b61028f610629565b60405161029c91906110d9565b60405180910390f35b6102bf60048036038101906102ba919061118f565b6106bb565b6040516102cc919061102e565b60405180910390f35b6102ef60048036038101906102ea919061118f565b610732565b6040516102fc919061102e565b60405180910390f35b61031f600480360381019061031a91906113e5565b610755565b005b61033b60048036038101906103369190611468565b61077f565b60405161034891906111de565b60405180910390f35b61036b600480360381019061036691906114a8565b610806565b005b60007f65787371000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061043857507fa219a025000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b80610448575061044782610824565b5b9050919050565b60606003805461045e90611546565b80601f016020809104026020016040519081016040528092919081815260200182805461048a90611546565b80156104d75780601f106104ac576101008083540402835291602001916104d7565b820191906000526020600020905b8154815290600101906020018083116104ba57829003601f168201915b5050505050905090565b6000806104ec61088e565b90506104f9818585610896565b600191505092915050565b6000600254905090565b60008061051961088e565b9050610526858285610a5f565b610531858585610aeb565b60019150509392505050565b60006012905090565b60008061055161088e565b9050610572818585610563858961077f565b61056d91906115a6565b610896565b600191505092915050565b600061058761088e565b90506105a481848460405180602001604052806000815250610d6a565b505050565b60006105b361088e565b90506105c0848284610a5f565b6105db84848460405180602001604052806000815250610d6a565b50505050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461063890611546565b80601f016020809104026020016040519081016040528092919081815260200182805461066490611546565b80156106b15780601f10610686576101008083540402835291602001916106b1565b820191906000526020600020905b81548152906001019060200180831161069457829003601f168201915b5050505050905090565b6000806106c661088e565b905060006106d4828661077f565b905083811015610719576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107109061164c565b60405180910390fd5b6107268286868403610896565b60019250505092915050565b60008061073d61088e565b905061074a818585610aeb565b600191505092915050565b600061075f61088e565b905061076c858285610a5f565b61077885858585610d6a565b5050505050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600061081061088e565b905061081e81858585610d6a565b50505050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610905576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108fc906116de565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610974576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161096b90611770565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610a5291906111de565b60405180910390a3505050565b6000610a6b848461077f565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610ae55781811015610ad7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ace906117dc565b60405180910390fd5b610ae48484848403610896565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b5a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b519061186e565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610bc9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bc090611900565b60405180910390fd5b610bd4838383610dc6565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610c5a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c5190611992565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610ced91906115a6565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610d5191906111de565b60405180910390a3610d64848484610dcb565b50505050565b610d75848484610aeb565b610d8184848484610dd0565b610dc0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610db790611a24565b60405180910390fd5b50505050565b505050565b505050565b6000610df18473ffffffffffffffffffffffffffffffffffffffff16610f57565b15610f4a578373ffffffffffffffffffffffffffffffffffffffff16639d188c22610e1a61088e565b8786866040518563ffffffff1660e01b8152600401610e3c9493929190611aa8565b6020604051808303816000875af1925050508015610e7857506040513d601f19601f82011682018060405250810190610e759190611b09565b60015b610efa573d8060008114610ea8576040519150601f19603f3d011682016040523d82523d6000602084013e610ead565b606091505b506000815103610ef2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ee990611ba8565b60405180910390fd5b805181602001fd5b639d188c2260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614915050610f4f565b600190505b949350505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b610fc381610f8e565b8114610fce57600080fd5b50565b600081359050610fe081610fba565b92915050565b600060208284031215610ffc57610ffb610f84565b5b600061100a84828501610fd1565b91505092915050565b60008115159050919050565b61102881611013565b82525050565b6000602082019050611043600083018461101f565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611083578082015181840152602081019050611068565b60008484015250505050565b6000601f19601f8301169050919050565b60006110ab82611049565b6110b58185611054565b93506110c5818560208601611065565b6110ce8161108f565b840191505092915050565b600060208201905081810360008301526110f381846110a0565b905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611126826110fb565b9050919050565b6111368161111b565b811461114157600080fd5b50565b6000813590506111538161112d565b92915050565b6000819050919050565b61116c81611159565b811461117757600080fd5b50565b60008135905061118981611163565b92915050565b600080604083850312156111a6576111a5610f84565b5b60006111b485828601611144565b92505060206111c58582860161117a565b9150509250929050565b6111d881611159565b82525050565b60006020820190506111f360008301846111cf565b92915050565b60008060006060848603121561121257611211610f84565b5b600061122086828701611144565b935050602061123186828701611144565b92505060406112428682870161117a565b9150509250925092565b600060ff82169050919050565b6112628161124c565b82525050565b600060208201905061127d6000830184611259565b92915050565b60006020828403121561129957611298610f84565b5b60006112a784828501611144565b91505092915050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6112f28261108f565b810181811067ffffffffffffffff82111715611311576113106112ba565b5b80604052505050565b6000611324610f7a565b905061133082826112e9565b919050565b600067ffffffffffffffff8211156113505761134f6112ba565b5b6113598261108f565b9050602081019050919050565b82818337600083830152505050565b600061138861138384611335565b61131a565b9050828152602081018484840111156113a4576113a36112b5565b5b6113af848285611366565b509392505050565b600082601f8301126113cc576113cb6112b0565b5b81356113dc848260208601611375565b91505092915050565b600080600080608085870312156113ff576113fe610f84565b5b600061140d87828801611144565b945050602061141e87828801611144565b935050604061142f8782880161117a565b925050606085013567ffffffffffffffff8111156114505761144f610f89565b5b61145c878288016113b7565b91505092959194509250565b6000806040838503121561147f5761147e610f84565b5b600061148d85828601611144565b925050602061149e85828601611144565b9150509250929050565b6000806000606084860312156114c1576114c0610f84565b5b60006114cf86828701611144565b93505060206114e08682870161117a565b925050604084013567ffffffffffffffff81111561150157611500610f89565b5b61150d868287016113b7565b9150509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061155e57607f821691505b60208210810361157157611570611517565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006115b182611159565b91506115bc83611159565b92508282019050808211156115d4576115d3611577565b5b92915050565b7f4b4950373a2064656372656173656420616c6c6f77616e63652062656c6f772060008201527f7a65726f00000000000000000000000000000000000000000000000000000000602082015250565b6000611636602483611054565b9150611641826115da565b604082019050919050565b6000602082019050818103600083015261166581611629565b9050919050565b7f4b4950373a20617070726f76652066726f6d20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b60006116c8602383611054565b91506116d38261166c565b604082019050919050565b600060208201905081810360008301526116f7816116bb565b9050919050565b7f4b4950373a20617070726f766520746f20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b600061175a602183611054565b9150611765826116fe565b604082019050919050565b600060208201905081810360008301526117898161174d565b9050919050565b7f4b4950373a20696e73756666696369656e7420616c6c6f77616e636500000000600082015250565b60006117c6601c83611054565b91506117d182611790565b602082019050919050565b600060208201905081810360008301526117f5816117b9565b9050919050565b7f4b4950373a207472616e736665722066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000611858602483611054565b9150611863826117fc565b604082019050919050565b600060208201905081810360008301526118878161184b565b9050919050565b7f4b4950373a207472616e7366657220746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b60006118ea602283611054565b91506118f58261188e565b604082019050919050565b60006020820190508181036000830152611919816118dd565b9050919050565b7f4b4950373a207472616e7366657220616d6f756e74206578636565647320626160008201527f6c616e6365000000000000000000000000000000000000000000000000000000602082015250565b600061197c602583611054565b915061198782611920565b604082019050919050565b600060208201905081810360008301526119ab8161196f565b9050919050565b7f4b4950373a207472616e7366657220746f206e6f6e20494b495037526563656960008201527f76657220696d706c656d656e7465720000000000000000000000000000000000602082015250565b6000611a0e602f83611054565b9150611a19826119b2565b604082019050919050565b60006020820190508181036000830152611a3d81611a01565b9050919050565b611a4d8161111b565b82525050565b600081519050919050565b600082825260208201905092915050565b6000611a7a82611a53565b611a848185611a5e565b9350611a94818560208601611065565b611a9d8161108f565b840191505092915050565b6000608082019050611abd6000830187611a44565b611aca6020830186611a44565b611ad760408301856111cf565b8181036060830152611ae98184611a6f565b905095945050505050565b600081519050611b0381610fba565b92915050565b600060208284031215611b1f57611b1e610f84565b5b6000611b2d84828501611af4565b91505092915050565b7f4b4950373a207472616e7366657220746f206e6f6e204b49503752656365697660008201527f657220696d706c656d656e746572000000000000000000000000000000000000602082015250565b6000611b92602e83611054565b9150611b9d82611b36565b604082019050919050565b60006020820190508181036000830152611bc181611b85565b905091905056fea26469706673582212207fabe84a0846dabbed692bd94a704424915d2d873d5adc033a954a17be91ff3364736f6c63430008110033";

module.exports = kip7bytecode;