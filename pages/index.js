import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';

const assets = [
  { name: 'Wind Turbine', src: '/assets/turbine.png', points: 5 },
  { name: 'House', src: '/assets/house.png', points: 2 },
  { name: 'Invoice', src: '/assets/invoice.png', points: 1 },
  { name: 'Car', src: '/assets/car.png', points: 3 },
  { name: 'Solar Panel', src: '/assets/solar.png', points: 4 }
];

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [showPoints, setShowPoints] = useState(false);

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
    const randIndex = Math.floor(Math.random() * assets.length);
    setCurrentAsset(assets[randIndex]);
    setShowPoints(false);
  };

  const handleClick = () => {
    if (!isGameRunning || !currentAsset) return;
    setScore((prev) => prev + currentAsset.points);
    setShowPoints(true);
    setTimeout(() => setShowPoints(false), 700);
    spawnAsset();
  };

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Tokenize Everything! | Novastro Clicker</title>
        <meta name="description" content="Click to tokenize real-world assets and earn points!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-4 text-white relative" style={{ backgroundImage: 'url(/stars-bg.jpg)' }}>
        {!submitted ? (
          <form onSubmit={handleNicknameSubmit} className="flex flex-col items-center bg-black/70 p-6 rounded-2xl shadow-xl">
            <h1 className="text-4xl font-bold text-purple-400 mb-4 drop-shadow">Enter Your Nickname</h1>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="px-4 py-2 rounded-lg text-black text-lg mb-4 border-2 border-purple-600 focus:border-yellow-400"
              placeholder="Your nickname"
              required
            />
            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:ring-2 hover:ring-yellow-300 transition-all">
              Continue
            </button>
          </form>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-2 text-yellow-300 text-center drop-shadow">Tokenize Everything! 🪙</h1>
            <p className="text-sm mb-2 text-center">Welcome, <span className="font-semibold text-purple-300">{nickname}</span></p>
            <p className="mb-1">⏳ Time Left: <span className="font-bold">{timeLeft}s</span></p>
            <p className="mb-4">🏆 Score: <span className="font-bold text-green-400">{score}</span></p>

            {isGameRunning && currentAsset && (
              <div className="flex flex-col items-center relative">
                <Image
                  src={currentAsset.src}
                  alt={currentAsset.name}
                  width={160}
                  height={160}
                  className="mb-2 animate-pulse"
                />
                <p className="mb-3 text-lg">{currentAsset.name}</p>
                <button
                  onClick={handleClick}
                  className="px-6 py-2 bg-yellow-500 text-black rounded-xl font-semibold hover:bg-yellow-400 transform hover:scale-105 transition"
                >
                  Tokenize
                </button>
                {showPoints && (
                  <div className="absolute top-0 text-green-400 font-bold text-xl animate-bounce">
                    +{currentAsset.points}
                  </div>
                )}
              </div>
            )}

            {!isGameRunning && timeLeft === 0 && (
              <div className="text-center mt-6 bg-black/60 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">🎮 Game Over!</h2>
                <p className="mb-2">{nickname}, your score is <span className="font-bold text-green-300">{score}</span></p>
                <Image src="/assets/traderibo.jpg" alt="Traderibo" width={60} height={60} className="mx-auto rounded-full mb-1 border border-purple-500" />
                <p className="text-xs text-white opacity-70 mb-3">Created by Traderibo123</p>
                <Image src="/novastro-logo.png" alt="Novastro Logo" width={60} height={60} className="mx-auto mb-4 opacity-80" />
                <button
                  onClick={startGame}
                  className="mt-2 px-6 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-500"
                >
                  🔁 Play Again
                </button>
              </div>
            )}

            {!isGameRunning && timeLeft === 30 && (
              <button
                onClick={startGame}
                className="mt-6 px-6 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-500 transition hover:scale-105"
              >
                Start Game
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}