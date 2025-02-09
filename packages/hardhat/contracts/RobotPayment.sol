// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RobotPayment {
    event PaymentReceived(address indexed user, uint256 amount);

    function payForAction() public payable {
        require(msg.value > 0, "Payment required");
        emit PaymentReceived(msg.sender, msg.value);
    }
}