export const GameState = {
  lives: 3,
  coins: 0,
  score: 0,
  reset() {
    this.lives = 3;
    this.coins = 0;
    this.score = 0;
  },
};
