// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// // import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(),],
//   define: {
//     // Zoom ko ye 'global' chahiye hota hai
//     'global': 'window',
//     'process.env': {}
//   },
//   resolve: {
//     alias: {
//       // Agar koi conflict ho toh lodash ko sahi se map karne ke liye
//       'lodash': 'lodash',
//     }
//   }
// });

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   define: {
//     // Zoom SDK in variables ko global scope mein dhundta hai
//     "global": "window",
//     "process.env": {},
//   },
//   resolve: {
//     alias: {
//       // Lodash mapping ensure karne ke liye
//       "lodash": "lodash",
//     },
//   },
//   // Zoom SDK heavy hai, isliye optimizeDeps mein dalna behtar hai
//   optimizeDeps: {
//     include: ["lodash", "@zoomus/websdk"],
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    // Zoom in variables ko dhoondta hai
    "global": "window",
    "process.env": {},
  },
  resolve: {
    alias: {
      "lodash": "lodash",
    },
  },
  optimizeDeps: {
    // Vite ko bolo ki inhe pehle se ready rakhe
    include: ["lodash", "@zoomus/websdk"],
  },
});
