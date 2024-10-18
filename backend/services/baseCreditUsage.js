class BaseCreditUsage {
    constructor(userCredits) {
      this.userCredits = userCredits;
    }
  
    canPerformTask(creditsRequired) {
      return this.userCredits >= creditsRequired;
    }
  
    deductCredits(creditsRequired) {
      if (this.canPerformTask(creditsRequired)) {
        this.userCredits -= creditsRequired;
        return true;
      }
      return false;
    }
  
    getUserCredits() {
      return this.userCredits;
    }
}
  
module.exports = BaseCreditUsage;
  