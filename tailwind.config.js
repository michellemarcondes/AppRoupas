/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fundo: "#E0F2FE", // sky-100 (Azul Claro)
        textoBase: "#0F172A", // slate-900 (Texto Principal Escuro)
        textoSuporte: "#64748B", // slate-500 (Texto Secundário Cinza)
        azul: { // Cor primária/destaque
          DEFAULT: "#3B82F6", // blue-500
          light: "#60A5FA",   // blue-400
          dark: "#2563EB",    // blue-600
        },
        cinza: { // Tons de cinza para bordas, fundos secundários, etc.
          100: "#F1F5F9", // slate-100 (Fundo sutilmente diferente)
          200: "#E2E8F0", // slate-200 (Bordas claras)
          800: "#1E293B", // slate-800 (Pode ser útil para texto em botões claros)
        }
      },
      fontFamily: {
        heading: "Inter_600SemiBold",
        subtitle: "Inter_500Medium",
        body: "Inter_400Regular",
        bold: "Inter_700Bold",
      },
    },
  },
  plugins: [],
};