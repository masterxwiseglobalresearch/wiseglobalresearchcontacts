// components/ThemeSelector.js

import React from 'react';
import { gradients, changeTheme } from '../themeFallbacks';


const ThemeSelector = () => {


  return (
    <div className="mt-4">
      <label htmlFor="theme" className="block mb-1 text-sm font-semibold text-white">
        🎨 Select Theme:
      </label>
      <select
        id="theme"
        onChange={(e) => changeTheme(e.target.value)}
        className="p-2 rounded text-black"
      >
        {Object.keys(gradients).map((key) => (
          <option key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
