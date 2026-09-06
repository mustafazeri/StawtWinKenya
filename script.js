const coinValue = 0.5;const lastSpin = localStorage.getItem("lastSpin");let canSpin = true;let score = 0;
let coins = 0;
let playerName = "";
let leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
let currentQuestion = 0;
let timeLeft = 15;
let timer;

const questions = [
  {
    question: "What is the capital city of Kenya?",
    options: ["Nairobi", "Mombasa", "Kisumu"],
    answer: 0
  },
  {
    question: "2 + 2 = ?",
    options: ["3", "4", "5"],
    answer: 1
  },
  {
    question: "Which color is the sky on a clear day?",
    options: ["Blue", "Green", "Red"],
    answer: 0
  }
];

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "" || password === "") {
        alert("Please enter your username and password.");
        return;
    }

    playerName = username;

    showMenu();
}

function showMenu() {
    document.body.innerHTML = `
        <div class="container">
            <h1>🎉 Welcome ${playerName}</h1>
            <h2>SmartWin Kenya</h2>

            <h3>🪙 Coins: ${coins}</h3>

            <button onclick="playGame()">🎮 Play Quiz</button><br><br><button onclick="wallet()">💰 Wallet</button><br><br>

            <button onclick="leaderboard()">🏆 Leaderboard</button><br><br><button onclick="spinWheel()">🎡 Spin & Win</button>

            <button onclick="profile()">👤 Profile</button><button onclick="dailyBonus()">🎁 Daily Bonus</button><button onclick="spinWheel()">🎡 Spin & Win</button><br><br>
        </div>
    `;
}function playGame() {
    clearInterval(timer);
    timeLeft = 15;

    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    document.body.innerHTML = `
        <div class="container">
            <h1>🎮 Quiz Time!</h1>

            <p><strong>Question ${currentQuestion + 1} of ${questions.length}</strong></p>

            <h2>⏰ Time Left: <span id="timer">15</span>s</h2>

            <h3>🪙 Coins: ${coins}</h3>

            <div class="progress">
                <div class="progress-bar" style="width:${progress}%"></div>
            </div>

            <p>${q.question}</p>

            <button onclick="answer(0)">${q.options[0]}</button><br><br>

            <button onclick="answer(1)">${q.options[1]}</button><br><br>

            <button onclick="answer(2)">${q.options[2]}</button>
        </div>
    `;

    timer = setInterval(function () {
        timeLeft--;

        document.getElementById("timer").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            answer(-1);
        }
    }, 1000);
}function answer(choice) {
    clearInterval(timer);

    if (choice === questions[currentQuestion].answer) {
        score += 10;
        coins += 5;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        playGame();
    } else {
        leaderboardData.push({
            name: playerName,
            score: score,
            coins: coins
        });

        leaderboardData.sort((a, b) => b.score - a.score);localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));

        document.body.innerHTML = `
            <div class="container">
                <h1>🎉 Quiz Finished!</h1>

                <h2>Player: ${playerName}</h2>

                <h2>⭐ Score: ${score}</h2>

                <h2>🪙 Coins Earned: ${coins}</h2>

                <button onclick="restartGame()">🎮 Play Again</button><br><br>

                <button onclick="leaderboard()">🏆 Leaderboard</button><br><br>

                <button onclick="profile()">👤 Profile</button>
            </div>
        `;
    }
}

function leaderboard() {
    let html = `
        <div class="container">
            <h1>🏆 Leaderboard</h1>
    `;

    if (leaderboardData.length === 0) {
        html += "<p>No scores yet.</p>";
    } else {
        for (let i = 0; i < leaderboardData.length; i++) {
            html += `
                <p>${i + 1}. ${leaderboardData[i].name} - ⭐ ${leaderboardData[i].score} | 🪙 ${leaderboardData[i].coins}</p>
            `;
        }
    }

    html += `
        <br><button onclick="showMenu()">🏠 Home</button>
        </div>
    `;

    document.body.innerHTML = html;
}

function profile() {
    document.body.innerHTML = `
        <div class="container">
            <h1>👤 Profile</h1>

            <p><strong>Name:</strong> ${playerName}</p>
            <p><strong>⭐ Score:</strong> ${score}</p>
            <p><strong>🪙 Coins:</strong> ${coins}</p>

            <button onclick="showMenu()">🏠 Home</button>
        </div>
    `;
}

function restartGame() {
    score = 0;
    coins = 0;
    currentQuestion = 0;
    showMenu();
}function dailyBonus() {
    let today = new Date().toDateString();
    let lastClaim = localStorage.getItem("dailyBonus");

    if (lastClaim === today) {
        alert("🎁 You have already claimed today's bonus!");
        return;
    }

    coins += 20;

    localStorage.setItem("dailyBonus", today);

    alert("🎉 Congratulations! You received 20 free coins.");
}function spinWheel() {
    const now = Date.now();
    const lastSpin = localStorage.getItem("lastSpin");

    if (lastSpin && now - Number(lastSpin) < 24 * 60 * 60 * 1000) {
        alert("⏳ You have already used today's spin. Come back tomorrow!");
        return;
    }

    localStorage.setItem("lastSpin", now);

    let prize = Math.floor(Math.random() * 4);

    if (prize === 0) {
        coins += 5;
        alert("🎉 You won 5 coins!");
    } else if (prize === 1) {
        coins += 10;
        alert("🎉 You won 10 coins!");
    } else if (prize === 2) {
        coins += 20;
        alert("🎉 JACKPOT! You won 20 coins!");
    } else {
        alert("😢 Better luck next time!");
    }

    showMenu();
}
function wallet() {
    let balance = (coins * coinValue).toFixed(2);

    document.body.innerHTML = `
        <div class="container">
            <h1>💰 My Wallet</h1>

            <h2>🪙 Coins: ${coins}</h2>

            <h2>💵 Balance: KSh ${balance}</h2>

            <button onclick="deposit()">➕ Deposit</button><br><br>

            <button onclick="withdraw()">💸 Withdraw</button><br><br>

            <button onclick="showMenu()">🏠 Home</button>
        </div>
    `;
}
function deposit() {
    let amount = prompt("Enter amount to deposit (KSh):");

    if (amount === null) {
        return;
    }

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        alert("❌ Please enter a valid amount.");
        return;
    }

    let earnedCoins = amount * 2;
    coins += earnedCoins;

    alert("✅ Deposit successful!\n\nKSh " + amount + " deposited.\nYou received " + earnedCoins + " coins.");

    wallet();
}

function withdraw() {
    let balance = (coins * coinValue).toFixed(2);

    if (coins < 100) {
        alert("❌ You need at least 100 coins (KSh 50) to withdraw.");
    } else {
        alert("✅ Withdrawal request for KSh " + balance + " submitted.");
    }
}