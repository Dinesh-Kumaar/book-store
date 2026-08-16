import React from "react";

function Main() {
  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center text-center px-6">

      <h1 className="text-4xl font-bold text-indigo-700 mb-4">
        Welcome to Our Book Store
      </h1>

      <p className="text-gray-700 max-w-2xl mb-6">
        Discover a wide collection of novels, programming books,
        science books, business books, and much more at affordable prices.
      </p>

      <h3 className="text-2xl font-semibold mb-3">
        Popular Books
      </h3>

      <ul className="list-disc list-inside text-left mb-6">
        <li>Atomic Habits</li>
        <li>The Alchemist</li>
        <li>Rich Dad Poor Dad</li>
        <li>The Psychology of Money</li>
      </ul>

      <button className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-900 transition">
        Explore Books
      </button>

    </main>
  );
}

export default Main;