pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./Token.sol";

contract TokenFactory {
    Token[] public tokens;

    event TokenCreated(address indexed token, uint);

    function createToken(string calldata name, string calldata symbol, uint8 tokenDecimals, uint totalSupply, address account) external {
        Token token = new Token(name, symbol, tokenDecimals, totalSupply, account);
        tokens.push(token);
        emit TokenCreated(address(token), tokens.length);
    }
    function tokensLength() external view returns (uint) {
        return tokens.length;
    }
}