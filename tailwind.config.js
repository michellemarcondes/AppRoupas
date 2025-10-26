/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
         //... cores definidas anteriormente ...
        fundo: "#E0F2FE",
        textoBase: "#0F172A",
        textoSuporte: "#64748B",
        azul: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
        },
        cinza: {
          100: "#F1F5F9",
          200: "#E2E8F0",
          800: "#1E293B",
        }
      },
      fontFamily: {
        heading: "Inter_600SemiBold",
        // VERIFICAR ESTA LINHA: O nome 'Inter_500Medium' está correto?
        subtitle: "Inter_500Medium", // <--- Conferir nome e case-sensitivity
        body: "Inter_400Regular",
        bold: "Inter_700Bold",
      },
    },
  },
  plugins: [],
};