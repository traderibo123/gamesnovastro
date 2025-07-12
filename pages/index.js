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
    let pool = rareChance < 0.1 ? assets : assets.filter(a => !a.rare);
    const randIndex = Math.floor(Math.random() * pool.length);
    setCurrentAsset(pool[randIndex]);
  };

  const handleClick = () => {
    if (!isGameRunning || !currentAsset) return;
    setScore((prev) => prev + currentAsset.points);
    setPointFeedback(`+${currentAsset.points}`);
    setTimeout(() => setPointFeedback(null), 800);
    spawnAsset();
  };

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) setSubmitted(true);
  };

  const shareOnTwitter = () => {
    const text = `${nickname} scored ${score} in the Novastro Tokenize Game! 🚀 Can you beat it?`;
    const url = encodeURIComponent('https://gamesnovastro.vercel.app');
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <>
      <Head>
        <title>Tokenize Everything! | Novastro Game</title>
        <meta name="description" content="Click to tokenize real-world assets and earn points!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="flex flex-col items-center justify-center min-h-screen text-white px-4 relative bg-cover overflow-hidden"
        style={{ backgroundImage: 'url("/assets/stars-bg.jpg")' }}
      >
        {/* Arka planda 40 Novastro logosu */}
        {[...Array(40)].map((_, i) => (
          <Image
            key={i}
            src="/assets/novastro-logo.png"
            alt="bg-logo"
            width={50}
            height={50}
            className="absolute opacity-5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 0
            }}
          />
        ))}

        {/* Giriş Ekranı */}
        {!submitted ? (
          <form onSubmit={handleNicknameSubmit} className="flex flex-col items-center backdrop-blur-sm p-6 rounded-lg bg-white/10 border border-cyan-400 z-10">
            <h1 className="text-3xl font-bold mb-2 text-center">Novastro Tokenize Games'e Hoş Geldin</h1>
            <p className="text-sm mb-4 text-center">Gerçek varlıkları tokenleştir ve puan kazan!</p>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Nickname"
              required
              className="px-4 py-2 text-black rounded"
            />
            <button type="submit" className="px-6 py-2 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-400 mt-4">
              Continue
            </button>
          </form>
        ) : (
          <div className="z-10 text-center">
            <h1 className="text-4xl font-bold mb-2">Tokenize Everything! 🪙</h1>
            <p className="text-sm mb-2">Welcome, <span className="font-semibold">{nickname}</span></p>
            <p className="mb-1">⏳ Time Left: <span className="font-bold">{timeLeft}s</span></p>
            <p className="mb-4">🏆 Score: <span className="font-bold">{score}</span></p>

            {isGameRunning && currentAsset && (
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-2">
                  <Image src={currentAsset.src} alt={currentAsset.name} width={180} height={180} />
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

                <div className="mt-4 flex gap-4 justify-center">
                  <button onClick={startGame} className="px-6 py-2 bg-green-600 rounded-xl font-bold text-white hover:bg-green-500">
                    Play Again
                  </button>
                  <button onClick={shareOnTwitter} className="px-6 py-2 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500">
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
          </div>
        )}
      </div>
    </>
  );
}
