// src/utils/apiConfig.ts

// **IMPORTANTE**: Use o IP LOCAL da sua máquina aqui!
const IP_BACKEND = "10.53.52.43"; // SUBSTITUA PELO SEU IP LOCAL ATUAL
const PORTA_BACKEND = process.env.PORT || "3333"; // Usa a porta do .env do backend ou 3333 como padrão

// URL base para chamadas da API
export const API_BASE_URL = `http://${IP_BACKEND}:${PORTA_BACKEND}/api`;

// URL base para acessar arquivos (se necessário diretamente)
export const FILES_BASE_URL = `http://${IP_BACKEND}:${PORTA_BACKEND}/files`;

// Log para confirmar o IP (aparecerá no console do Metro Bundler)
console.log(`[API Config] Conectando ao backend em: ${API_BASE_URL}`);