# Turnstile (FSM) smart contract

A contract for determining the winner between two players in a game of rock paper scissors.

## Usage

The contract exposes three methods: `pick-player-1-choice`, `pick-player-2-choice`, and `determine-winner`.

### `pick-player-1-choice`, `pick-player-2-choice`

These methods change the state of `player-1-choice` and `player-2-choice` respectively. They take in values of "R", "P", or "S".

### `determine-winner`

This method uses the current state of `player-1-choice` and `player-2-choice` and returns 0 if tied, 1 if player 1 wins, and 2 if player 2 wins.
