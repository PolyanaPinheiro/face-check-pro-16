/**
 * URL base do backend Node.
 *
 * Em desenvolvimento: http://localhost:3001
 * Em produção (celular/APK): defina VITE_API_URL no .env.production
 *   VITE_API_URL=https://seu-backend.railway.app
 */
export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3001";
