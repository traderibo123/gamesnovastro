import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';

const assets = [
  { name: 'Wind Turbine', src: '/assets/turbine.png', points: 5 },
  { name: 'House', src: '/assets/house.png', points: 2 },
  { name: 'Invoice', src: '/assets/invoice.png', points: 1 },
  { name: 'Car', src: '/assets/car.png', points: 3 },
  { name: 'Solar Panel', src: '/assets/solar.png', points: 4 },
  { name: 'Novastro Logo', src: '/assets/novastro-logo.png', points: 20, rare: true }
];

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [pointFeedback, setPointFeedback] = useState(null);

  useEffect(() => {
    let interval;
    if (isGameRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsGameRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameRunning]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameRunning(true);
    spawnAsset();
  };

  const spawnAsset = () => {
    const rareChance = Math.random();
    const pool = rareChance < 0.1 ? assets : assets.filter((a) => !a.rare);
    const randIndex = Math.floor(Math.random() * pool.length);
    setCurrentAsset(pool[randIndex]);
  };

  const handleClick = () => {
    if (!isGameRunning || !currentAsset) return;
    setScore((prev) => prev + currentAsset.points);
    setPointFeedback(`+${currentAsset.points}`);
    setTimeout(() => setPointFeedback(null), 1000);
    spawnAsset();
  };

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) setSubmitted(true);
  };

  const handleShare = () => {
    const tweet = `I scored ${score} in the Novastro Tokenize Game! 🪙
Play now: https://gamesnovastro.vercel.app/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Head>
        <title>Tokenize Everything! | Novastro Game</title>
        <meta name="description" content="Click to tokenize real-world assets and earn points!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="flex flex-col items-center justify-center min-h-screen text-white px-4 relative bg-cover"
        style={{ backgroundImage: 'url("/assets/stars-bg.jpg")' }}
      >
        {!submitted ? (
          <form onSubmit={handleNicknameSubmit} className="flex flex-col items-center backdrop-blur-sm p-6 rounded-lg bg-white/10 border border-cyan-400">
            <h1 className="text-3xl font-bold mb-2 text-center">Welcome to</h1>
            <h2 className="text-4xl font-extrabold mb-4 text-center text-cyan-300">Novastro Tokenize Games</h2>
            <p className="text-sm text-center text-white/70 mb-6">Start your mission by entering your nickname:</p>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname"
              required
              className="px-4 py-2 text-black rounded w-64"
            />
            <button type="submit" className="px-6 py-2 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-400 mt-4">
              Continue
            </button>
          </form>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-2 text-center">Tokenize Everything! 🪙</h1>
            <p className="text-sm mb-2 text-center">Welcome, <span className="font-semibold">{nickname}</span></p>
            <p className="mb-1">⏳ Time Left: <span className="font-bold">{timeLeft}s</span></p>
            <p className="mb-4">🏆 Score: <span className="font-bold">{score}</span></p>

            {isGameRunning && currentAsset && (
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <Image
                    src={currentAsset.src}
                    alt={currentAsset.name}
                    width={180}
                    height={180}
                  />
                  {pointFeedback && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 text-yellow-300 font-bold text-xl animate-bounce">
                      {pointFeedback}
                    </span>
                  )}
                </div>
                <p className="mb-3 text-lg">{currentAsset.name}</p>
              </div>
            )}

            {isGameRunning && (
              <button
                onClick={handleClick}
                className="fixed bottom-24 px-6 py-3 bg-yellow-500 text-black rounded-xl font-semibold hover:bg-yellow-400"
              >
                Tokenize
              </button>
            )}

            {!isGameRunning && timeLeft === 0 && (
              <div className="text-center mt-6">
                <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
                <p className="mb-2">{nickname}, your score is <span className="font-bold">{score}</span></p>
                <Image src="/assets/traderibo.jpg" alt="Traderibo" width={60} height={60} className="mx-auto rounded-full mb-1" />
                <p className="text-xs text-white opacity-70">Created by Traderibo123</p>
                <div className="flex justify-center mt-4 gap-4">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-500"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-6 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500"
                  >
                    Share on X
                  </button>
                </div>
              </div>
            )}

            {!isGameRunning && timeLeft === 30 && (
              <button
                onClick={startGame}
                className="mt-6 px-6 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-500"
              >
                Start Game
              </button>
            )}
          </>
        )}

        <Image
          src="/assets/novastro-logo.png"
          alt="Novastro Logo"
          width={80}
          height={80}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-90"
        />        <Image
          src="/assets/novastro-logo.png"
          alt="Novastro Watermark"
          width={100}
          height={100}
          className="fixed bottom-4 right-4 opacity-10 pointer-events-none"
        />
      </div>
    </>
  );
}

      </div>
    </>
  );
}
