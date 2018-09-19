/*

  Copyright 2018 CoinAlpha, Inc.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

pragma solidity 0.4.21;

import "./zeppelin/Ownable.sol";

contract IKYC {
  function isWhitelistedHolder (address) public view returns (bool) {}
}

/// @title KYCWhitelist -- Whitelist contract to limit participants to KYCed individuals, to ensure legal compliance
/// @author CoinAlpha, Inc. <contact@coinalpha.com>
contract KYC is Ownable {
  // Mappings
  mapping(address => bool) public whitelistedHolders;

  // Events
  event LogWhitelistHolder(address indexed whitelistedHolder);
  event LogUnwhitelistHolder(address indexed unwhitelistedHolder);

  /// @dev KYC constructor
  function KYC() public {
    owner = msg.sender;
  }

  /// @dev Check if address is a whitelisted holder
  /// @param  _holder                              holder address
  /// @return success                              is whitelisted
  function isWhitelistedHolder(address _holder) public view returns (bool) {
    return whitelistedHolders[_holder];
  }

  /// @dev Whitelist an address to become a holder
  /// @param  _addressToWhitelist                  address to be whitelisted
  /// @return success                              Operation successful
  function whitelistHolder(address _addressToWhitelist) public onlyOwner returns (bool) {
    whitelistedHolders[_addressToWhitelist] = true;
    emit LogWhitelistHolder(_addressToWhitelist);
    return true;
  }

  /// @dev Remove an address from whitelisted holders
  /// @param  _addressToUnwhitelist                address to remove from whitelist
  /// @return success                              Operation successful
  function unWhitelistHolder(address _addressToUnwhitelist) public onlyOwner returns (bool) {
    whitelistedHolders[_addressToUnwhitelist] = false;
    emit LogUnwhitelistHolder(_addressToUnwhitelist);
    return true;
  }

  /// @dev Fallback to reject any ether sent to contract
  //  Check: "KYC does not accept ETH transfers"
  function () public payable { revert(); }
}
