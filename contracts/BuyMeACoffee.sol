// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Using openzeppeling ownable module
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee is Ownable {
  // Event to be emitted when a new coffee is bought with a memo
  event NewMemo(address indexed from,
                uint256 indexed timestamp,
                string name,
                string message);

  // Memo structure
  struct Memo {
    address from;
    uint256 timestamp;
    string name;
    string message;
  }

  // Array of all memos
  Memo[] memos;

  // Owners address (using the OpenZeppelein Ownable module)
  // address payable owner;

  // Constructor (only called on deployment of the contract) (using the OpenZeppelein Ownable module)
  // constructor() {
  //   // Set the owner to the address that deployed the contract
  //   owner = payable(msg.sender);
  // }

  // Logic functions
  /**
  * @dev Buy a coffee for the contract owner
  * @param _name Name of the buyer
  * @param _message Message to be sent to the owner
  */
  function buyCoffee(string memory _name, string memory _message) public payable {
    require(msg.value > 0, "Can't buy a coffee with nothing :(");

    // if requirement met, create a memo and add it to the list of memos
    memos.push(Memo(msg.sender, block.timestamp, _name, _message));

    // emit the NewMemo event
    emit NewMemo(msg.sender, block.timestamp, _name, _message);
  }

  /**
  * @dev Allows owner to withdraw all tips
  */
  function withdrawTips() public onlyOwner {
    // require that the caller is owner
    require(msg.sender == owner(), "Only the owner can withdraw tips");
    // Transfer all the contract's balance to the owner
    require(payable(owner()).send(address(this).balance));
  }

  /**
  * @dev Returns a view of all the memos
  */
  function getMemos() public view returns (Memo[] memory) {
    return memos;
  }

  /// EXPERIMENTAL ///
  function getOwner() public view returns (address) {
    return owner();
  }


}
