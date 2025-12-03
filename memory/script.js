class Game {
  constructor(time, cards) {
    this.cards = cards;
    this.totTime = time;
    this.timeLeft = time;
    this.timer = document.getElementById("timer");
    this.flipCount = document.getElementById("flips");
  }

  start() {
    this.busy = true;
    this.hide();
    this.checking = null;
    this.flips = 0;
    this.timeLeft = this.totTime;
    this.matched = [];
    this.shuffle();
    this.timer.innerText = this.timeLeft;
    this.flipCount.innerText = this.flips;
  }

  stop() {
    clearInterval(this.countdown);
    let score = Math.floor(this.timeLeft * 100 - this.flips);
    document.getElementById("final-score").innerText = (score < 0) ? 0 : score;
    document.getElementById("result").classList.add("visible");
  }

  shuffle() {
    setTimeout(() => {
      for (let i = 0; i != this.cards.length - 1; i++) {
        let j = Math.floor(i + Math.random() * ((this.cards.length - 1) - i + 1));
        this.cards[j].style.order = i;
        this.cards[i].style.order = j;
      }

      setTimeout(this.reveal(), 250);
    }, 250);
  }

  reveal() {
    this.cards.forEach(card => {
      card.classList.add("visible");
    });

    setTimeout(() => {
      this.hide();
      setTimeout(() => {
        this.countdown = this.startTimer();
        this.busy = false;
      }, 250);
    }, 1000);
  }

  hide() {
    this.cards.forEach(card => {
      card.classList.remove("matched");
      card.classList.remove("visible");
    });
  }

  canFlip(card) {
    return (!this.busy && !this.matched.includes(card) && card !== this.checking)
  }

  flip(card) {
    if (this.canFlip(card)) {
      this.flips++;
      this.flipCount.innerText = this.flips;
      card.classList.add("visible");

      if (this.checking) {
        this.checkMatch(card);
      } else
        this.checking = card;
    }
  }

  checkMatch(card) {
    this.busy = true;

    if (this.checking.innerText.toUpperCase() === card.innerText.toUpperCase()) {
      this.match(card);
    } else {
      this.mismatch(card);
    }
  }

  match(card) {
    this.matched.push(card);
    this.matched.push(this.checking);
    card.classList.add("matched");
    this.checking.classList.add("matched");
    this.checking = null;
    this.busy = false;

    if (this.matched.length === this.cards.length)
      this.stop();
  }

  mismatch(card) {
    this.busy = true;
    setTimeout(() => {
      card.classList.remove("visible");
      this.checking.classList.remove("visible");
      this.checking = null;
      setTimeout(() => {this.busy = false}, 250);
    }, 1000);
  }

  startTimer() {
    return setInterval(() => {
      this.timeLeft--;
      this.timer.innerText = this.timeLeft;
      if (this.timeLeft <= 0) {
        this.stop();
      }
    }, 1000);
  }
}

let init = () => {
  let overlays = Array.from(document.getElementsByClassName("overlay"));
  let cards = Array.from(document.getElementsByClassName("card"));
  let game = new Game(100, cards);

  overlays.forEach(overlay => {
    overlay.addEventListener("click", () => {
      overlay.classList.add("hidden");
      setTimeout(() => {
        overlay.classList.remove("visible");
        overlay.classList.remove("hidden");
        game.start();
      }, 250);
    });
  });

  cards.forEach(card => {
    card.addEventListener("click", () => {
      game.flip(card);
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init());
} else {
  init();
}
