const Survey = artifacts.require('./Survey.sol');

contract('Survey', async (accounts) => {
  describe('Owner creates a question', () => {
    var contract;
    var sendAmt = 10;
    var owner   = accounts[0];
    var sender  = accounts[1];
    var sender2 = accounts[2];
    var sender3 = accounts[3];
    var sender4 = accounts[4];
    var sender5 = accounts[5];

    before(function() {
      return Survey.new(owner, { from: owner })
      .then((instance) => {
         contract = instance;
         contract.depositRewardAmount({
           from: owner,
           value: sendAmt,
         });
      });
    });

    it('returns the owner', async () => {
      const currentOwner = await contract.getOwner();
      assert.equal(currentOwner, owner, 'Owner address does not match');
    });

    it('returns the deposit amount', async () => {
      const currentDepositAmount = await contract.getBalance();
      assert.equal(currentDepositAmount.c[0], sendAmt, 'deposit invalid');
    });

    it('returns the proper questionCount', async () => {
      await contract.createQuestion('Q1', 'Q2', 'Q3', {
        from: owner,
      });

      const questionCount = await contract.getQuestionCount();
      assert.equal(questionCount.c[0], 3, 'Wrong # of questions created');
    });

    it('gives answers and confirms survey is closed', async () => {
      await contract.giveAnswers([true, true, true], {
        from: sender
      });
      await contract.giveAnswers([true, false, false], {
        from: sender2
      });
      await contract.giveAnswers([false, false, false], {
        from: sender3
      });
      await contract.giveAnswers([false, false, false], {
        from: sender4
      });

      const remainingSurveyCount = await contract.getRemainingSurveyCount();
      assert.equal(remainingSurveyCount.c[0], 0, 'Survey should be completed');
    });

    it('gives the correct results', async () => {
      const yesResults = await contract.getResults(true);
      const noResults = await contract.getResults(false);

      const yesArray = yesResults.map((yes) => yes.c[0]);
      const noArray = noResults.map((no) => no.c[0]);

      assert.equal(yesArray[0], 2, 'invalid result');
      assert.equal(yesArray[1], 1, 'invalid result');
      assert.equal(yesArray[2], 1, 'invalid result');
      assert.equal(noArray[0], 2, 'invalid result');
      assert.equal(noArray[1], 3, 'invalid result');
      assert.equal(noArray[2], 3, 'invalid result');
    });

    it('marks the correct participants', async () => {
      const participantInfo = await contract.getParticipant(sender);
      const participantInfo2 = await contract.getParticipant(sender2);
      const participantInfo3 = await contract.getParticipant(sender3);
      const participantInfo4 = await contract.getParticipant(sender4);
      const participantInfo5 = await contract.getParticipant(sender5);

      assert.isTrue(participantInfo);
      assert.isTrue(participantInfo2);
      assert.isTrue(participantInfo3);
      assert.isTrue(participantInfo4);
      assert.isFalse(participantInfo5);
    });

    it('does not allow payout due to owner circuit breaker', async () => {
      let stoppedValue;
      stoppedValue = await contract.getStopped();
      assert.isFalse(stoppedValue);

      await contract.toggle_active();
      stoppedValue = await contract.getStopped();
      assert.isTrue(stoppedValue);

      try {
        const result = await contract.payoutParticipant({
          from: sender,
        });
      } catch (error) {
        assert(error);
      }
      // Reset back to stopped = false;
      await contract.toggle_active();
    });

    it('does not payout due to invalid user', async () => {
      let errorMessage;

      try {
        await contract.payoutParticipant({
          from: sender4,
        });
      } catch (error) {
        assert(error);

        const contractBalance = (await contract.getBalance()).c[0];
        assert.equal(contractBalance, sendAmt);
      }
    });

    it('pays out participant', async () => {
      const contractBalance = (await contract.getBalance()).c[0];

      const result = await contract.payoutParticipant({
        from: sender,
      });

      const newBalance = (await contract.getBalance()).c[0];
      const participantInfo = await contract.getParticipant(sender);

      assert.isBelow(newBalance, contractBalance);
      assert.isFalse(participantInfo);
    });
  });
});
