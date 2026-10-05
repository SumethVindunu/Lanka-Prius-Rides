import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

const postcssConfig = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default postcssConfig;  
