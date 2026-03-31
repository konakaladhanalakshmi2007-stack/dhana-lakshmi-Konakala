import React, { useEffect, useRef, useState, useCallback } from 'react';

const GRID_W = 20;
const GRID_H = 20;
const CELL_SIZE = 20;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'AWAITING_INPUT' | 'EXECUTING' | 'FATAL_ERROR'>('AWAITING_INPUT');
  const [shake, setShake] = useState(0);

  // Game state refs to avoid dependency issues in loop
  const snake = useRef([{x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}]);
  const dir = useRef({x: 0, y: -1});
  const nextDir = useRef({x: 0, y: -1});
  const food = useRef({x: 5, y: 5});
  const speed = useRef(120);

  const initGame = () => {
    snake.current = [{x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}];
    dir.current = {x: 0, y: -1};
    nextDir.current = {x: 0, y: -1};
    food.current = {x: Math.floor(Math.random() * GRID_W), y: Math.floor(Math.random() * GRID_H)};
    setScore(0);
    setStatus('EXECUTING');
  };

  // Game loop
  useEffect(() => {
    if (status !== 'EXECUTING') return;
    let timeoutId: NodeJS.Timeout;

    const loop = () => {
      dir.current = nextDir.current;
      const head = snake.current[0];
      const newHead = {
        x: head.x + dir.current.x,
        y: head.y + dir.current.y
      };

      // Collision with walls
      if (newHead.x < 0 || newHead.x >= GRID_W || newHead.y < 0 || newHead.y >= GRID_H) {
        setStatus('FATAL_ERROR');
        setShake(15);
        return;
      }

      // Collision with self
      if (snake.current.some(s => s.x === newHead.x && s.y === newHead.y)) {
        setStatus('FATAL_ERROR');
        setShake(15);
        return;
      }

      snake.current.unshift(newHead);

      // Eat food
      if (newHead.x === food.current.x && newHead.y === food.current.y) {
        setScore(s => s + 1);
        setShake(4); // Juice: slight shake on eat
        
        // Generate new food not on snake
        let newFood;
        while (true) {
          newFood = { x: Math.floor(Math.random() * GRID_W), y: Math.floor(Math.random() * GRID_H) };
          const isOnSnake = snake.current.some(s => s.x === newFood.x && s.y === newFood.y);
          if (!isOnSnake) break;
        }
        food.current = newFood;
      } else {
        snake.current.pop();
      }

      draw();
      timeoutId = setTimeout(loop, speed.current);
    };

    timeoutId = setTimeout(loop, speed.current);
    return () => clearTimeout(timeoutId);
  }, [status]);

  // Draw
  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, GRID_W * CELL_SIZE, GRID_H * CELL_SIZE);

    // Raw grid lines
    ctx.strokeStyle = '#00FFFF';
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;
    for(let i=0; i<=GRID_W; i++) {
      ctx.beginPath(); ctx.moveTo(i*CELL_SIZE, 0); ctx.lineTo(i*CELL_SIZE, GRID_H*CELL_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i*CELL_SIZE); ctx.lineTo(GRID_W*CELL_SIZE, i*CELL_SIZE); ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Food (Magenta)
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(food.current.x * CELL_SIZE + 1, food.current.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    // Snake (Cyan)
    snake.current.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#FFFFFF' : '#00FFFF';
      ctx.fillRect(s.x * CELL_SIZE + 1, s.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });
  }, []);

  // Initial draw
  useEffect(() => { draw(); }, [draw]);

  // Shake effect
  useEffect(() => {
    if (shake > 0) {
      const id = setTimeout(() => setShake(shake - 1), 50);
      return () => clearTimeout(id);
    }
  }, [shake]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        if (status === 'AWAITING_INPUT' || status === 'FATAL_ERROR') initGame();
        else setStatus(s => s === 'EXECUTING' ? 'AWAITING_INPUT' : 'EXECUTING');
        e.preventDefault();
        return;
      }
      if (status !== 'EXECUTING') return;
      
      const { x, y } = dir.current;
      switch (e.key) {
        case 'ArrowUp': if (y !== 1) nextDir.current = {x: 0, y: -1}; e.preventDefault(); break;
        case 'ArrowDown': if (y !== -1) nextDir.current = {x: 0, y: 1}; e.preventDefault(); break;
        case 'ArrowLeft': if (x !== 1) nextDir.current = {x: -1, y: 0}; e.preventDefault(); break;
        case 'ArrowRight': if (x !== -1) nextDir.current = {x: 1, y: 0}; e.preventDefault(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  const shakeStyle = shake > 0 ? { transform: `translate(${(Math.random()-0.5)*shake*2}px, ${(Math.random()-0.5)*shake*2}px)` } : {};

  return (
    <div className="border-4 border-[#00FFFF] bg-black p-4 relative shadow-[8px_8px_0px_#FF00FF]" style={shakeStyle}>
      <div className="flex justify-between font-mono text-[#FF00FF] mb-4 text-sm md:text-base">
        <span>SEQ_SCORE:{score.toString().padStart(4, '0')}</span>
        <span className="animate-pulse">{status}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={GRID_W * CELL_SIZE}
        height={GRID_H * CELL_SIZE}
        className="border-2 border-[#FF00FF] w-full max-w-[400px] aspect-square bg-black block"
      />
      {status !== 'EXECUTING' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-center">
            <p className="text-[#00FFFF] font-mono text-xl md:text-2xl glitch-text" data-text={status === 'FATAL_ERROR' ? 'SYSTEM_FAILURE' : 'STANDBY'}>
              {status === 'FATAL_ERROR' ? 'SYSTEM_FAILURE' : 'STANDBY'}
            </p>
            <p className="text-white font-sans text-xl mt-6 animate-pulse">PRESS [SPACE] TO EXECUTE</p>
          </div>
        </div>
      )}
    </div>
  );
};
