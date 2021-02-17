import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";

const rock = '"R"';
const paper = '"P"';
const scissor = '"S"';

describe("rps contract test suite", () => {
  let rpsClient: Client;
  let provider: Provider;

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    rpsClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.rps", "rps", provider);
  });
  it("should have a valid syntax", async () => {
    await rpsClient.checkContract();
  });

  
  const pickPlayerChoice = async(player: number, choice: string) => {
      const tx = rpsClient.createTransaction({
        method: {
          name: `pick-player-${player}-choice`,
          args: [choice],
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await rpsClient.submitTransaction(tx);
    return receipt
  }

  const getPlayerChoice = async(player: number) => {
    const query = rpsClient.createQuery({
      method: { name: `get-player-${player}-choice`, args: [] },
    });
    const receipt = await rpsClient.submitQuery(query);
    const result = Result.unwrapString(receipt, "ascii");
    return result;
  }

  const determineWinner = async() => {
    const query = rpsClient.createQuery({
      method: { name: `determine-winner`, args: []},
    });
    const receipt = await rpsClient.submitQuery(query);
    const result = Result.unwrapInt(receipt);
    return result
  }


  describe("deploying an instance of the contract", () => {
    const execQuery = async (method: string, args: string[]) => {
      const query = rpsClient.createQuery({
        method: { name: method, args: args }
      });
      const receipt = await rpsClient.submitQuery(query);
      const result = Result.unwrapString(receipt, "ascii");
      return result;
    }
    const execMethod = async (method: string, args: string[]) => {
      const tx = rpsClient.createTransaction({
        method: {
          name: method,
          args: args
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await rpsClient.submitTransaction(tx);
      return receipt;
    }
    before(async () => {
      await rpsClient.deployContract();
    });
    it("player 1 should start at R", async () => {
      const player1Choice = await execQuery("get-player-1-choice", []);
      assert.equal(player1Choice, rock);
    })
    it("player 2 should start at R", async () => {
      const player2Choice = await execQuery("get-player-2-choice", []);
      assert.equal(player2Choice, rock);
    })
    it("should change player 1 choice to scissor", async () => {
      await pickPlayerChoice(1, scissor);
      const player1Choice = await getPlayerChoice(1);
      assert.equal(player1Choice, scissor);
    })
    it("should change player 2 choice to scissor", async () => {
      await pickPlayerChoice(2, scissor);
      const player1Choice = await getPlayerChoice(2);
      assert.equal(player1Choice, scissor);
    })
    it("should change player 1 choice to paper", async () => {
      await pickPlayerChoice(1, paper);
      const player1Choice = await getPlayerChoice(1);
      assert.equal(player1Choice, paper);
    })
    it("should change player 2 choice to paper", async () => {
      await pickPlayerChoice(2, paper);
      const player1Choice = await getPlayerChoice(2);
      assert.equal(player1Choice, paper);
    })
    it("paper vs paper should result in tie", async () => {
      const winner = await determineWinner();
      assert.equal(winner, 0)
    })
    it("rock vs rock should result in tie", async () => {
      await pickPlayerChoice(1, rock);
      await pickPlayerChoice(2, rock);
      const winner = await determineWinner();
      assert.equal(winner, 0)
    })
    it("scissor vs scissor should result in tie", async () => {
      await pickPlayerChoice(1, scissor);
      await pickPlayerChoice(2, scissor);
      const winner = await determineWinner();
      assert.equal(winner, 0)
    })
    it("rock vs scissor should result in player 1 win", async () => {
      await pickPlayerChoice(1, rock);
      await pickPlayerChoice(2, scissor);
      const winner = await determineWinner();
      assert.equal(winner, 1)
    })
    it("paper vs rock should result in player 1 win", async () => {
      await pickPlayerChoice(1, paper);
      await pickPlayerChoice(2, rock);
      const winner = await determineWinner();
      assert.equal(winner, 1)
    })
    it("scissor vs paper should result in player 1 win", async () => {
      await pickPlayerChoice(1, scissor);
      await pickPlayerChoice(2, paper);
      const winner = await determineWinner();
      assert.equal(winner, 1)
    })
    it("rock vs paper should result in player 2 win", async () => {
      await pickPlayerChoice(1, rock);
      await pickPlayerChoice(2, paper);
      const winner = await determineWinner();
      assert.equal(winner, 2)
    })
    it("paper vs scissor should result in player 2 win", async () => {
      await pickPlayerChoice(1, paper);
      await pickPlayerChoice(2, scissor);
      const winner = await determineWinner();
      assert.equal(winner, 2)
    })
    it("scissor vs rock should result in player 2 win", async () => {
      await pickPlayerChoice(1, scissor);
      await pickPlayerChoice(2, rock);
      const winner = await determineWinner();
      assert.equal(winner, 2)
    })
  });
  after(async () => {
    await provider.close();
  });
});
