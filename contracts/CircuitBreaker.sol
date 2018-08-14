pragma solidity ^0.4.24;

import "./Owner.sol";

contract CircuitBreaker is Owned {
    constructor() public {
        stopped = false;
    }

    function toggle_active() only_owner public {
      stopped = !stopped;
    }

    modifier stop_if_emergency() {
        if (!stopped) _;
    }

    modifier emergency_only() {
        if (stopped) _;
    }

    bool stopped;
}
