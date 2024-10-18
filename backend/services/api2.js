const BaseCreditUsage = require('./baseCreditUsage');

class ApiTwoCreditUsage extends BaseCreditUsage {
  constructor(userCredits) {
    super(userCredits);
    this.creditsPerCall = 20;
  }

  performApiTwoTask() {
    if (this.deductCredits(this.creditsPerCall)) {
      return { success: true, remainingCredits: this.getUserCredits() , apiCredits: this.creditsPerCall };
    } else {
      console.log("Insufficient Credits");
      return { success: false, message: "Insufficient Credits to perform task", remainingCredits: this.getUserCredits(), apiCredits: this.creditsPerCall };
    }
  }

  creditsPerCall() {
    return this.creditsPerCall;
  }
  
}

module.exports = ApiTwoCreditUsage;
