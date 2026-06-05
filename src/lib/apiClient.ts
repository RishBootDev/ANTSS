/**
 * Centralized API Client
 *
 * Single source of truth for the backend base URL.
 * All service files import API_BASE from here instead of
 * hardcoding URLs or relying on dev-server proxies.
 *
 * Environment variable:
 *   VITE_API_URL — Full backend origin, e.g. https://api.antss.in
 *                  For local development: http://localhost:2030
 *
 * Usage in service files:
 *   import { API_BASE } from '@/lib/apiClient';
 *   fetch(`${API_BASE}/auth/login`, { ... });
 */

const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

/**
 * API_BASE — resolves to the full API prefix.
 *
 * Examples:
 *   VITE_API_URL=https://api.antss.in  → API_BASE = "https://api.antss.in/api"
 *   VITE_API_URL=http://localhost:2030  → API_BASE = "http://localhost:2030/api"
 */
export const API_BASE = baseUrl ? `${baseUrl.replace(/\/+$/, '')}/api` : '/api';
