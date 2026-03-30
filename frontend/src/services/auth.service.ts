/**
 * Auth Service
 * 
 * Servicio de autenticación para el frontend del IDP Asistente Contable.
 * Este archivo re-exporta las funciones del servicio api.ts para mejor organización.
 * 
 * @module services/auth.service
 */

export { authService, tokenStorage } from './api'
export type { TokenResponse, User } from '@/types'
