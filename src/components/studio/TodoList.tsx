'use client';

import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Record voiceover', done: false },
    { id: 2, text: 'Export rough cut', done: false },
    { id: 3, text: 'Choose soundtrack', done: true },
    { id: 4, text: 'Shoot B-roll', done: false },
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const remaining = todos.filter(t => !t.done).length;

  return (
    <div className="bg-[#FBF8F3] border border-[#D9CEC1] rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#806F62] uppercase font-bold">
            TODAY
          </span>
          <span className="text-[10px] font-sans text-[#806F62]">{remaining} things left</span>
        </div>

        <div className="space-y-1.5 mt-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              onClick={() => toggleTodo(todo.id)}
              className="flex items-center gap-2 text-xs font-sans text-[#3D2B1F] cursor-pointer"
            >
              <span className={todo.done ? 'text-[#806F62]' : 'text-[#3D2B1F]'}>
                {todo.done ? '✓' : '○'}
              </span>
              <span className={todo.done ? 'line-through text-[#806F62]' : ''}>
                {todo.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}