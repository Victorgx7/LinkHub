import { z } from 'zod';
import { SLUGS_RESERVADOS } from '@/lib/constantes';

/**
 * Esquema de validação para login com e-mail e senha
 */
export const esquemaLogin = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório' })
    .email('Formato de e-mail inválido')
    .trim()
    .toLowerCase(),
  senha: z
    .string({ required_error: 'A senha é obrigatória' })
    .min(6, 'A senha deve conter no mínimo 6 caracteres'),
});

/**
 * Esquema de validação para aceite de convite e definição de senha
 */
export const esquemaAceitarConvite = z.object({
  nome: z
    .string({ required_error: 'O nome é obrigatório' })
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(120, 'O nome deve ter no máximo 120 caracteres')
    .trim(),
  senha: z
    .string({ required_error: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter ao menos um número'),
});

/**
 * Esquema de validação para solicitação de recuperação de senha
 */
export const esquemaSolicitarRecuperacao = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório' })
    .email('Formato de e-mail inválido')
    .trim()
    .toLowerCase(),
});

/**
 * Esquema de validação para redefinição de senha com token
 */
export const esquemaRedefinirSenha = z.object({
  senha: z
    .string({ required_error: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter ao menos um número'),
});

/**
 * Esquema de validação para criação de convite
 */
export const esquemaCriarConvite = z.object({
  perfilId: z.string({ required_error: 'O perfil é obrigatório' }).uuid('ID de perfil inválido'),
  email: z
    .string({ required_error: 'O e-mail é obrigatório' })
    .email('Formato de e-mail inválido')
    .trim()
    .toLowerCase(),
});

/**
 * Esquema de validação para criação ou edição de perfil
 */
export const esquemaPerfil = z.object({
  slug: z
    .string({ required_error: 'O slug (endereço) é obrigatório' })
    .min(3, 'O endereço deve ter no mínimo 3 caracteres')
    .max(80, 'O endereço deve ter no máximo 80 caracteres')
    .regex(/^[a-z0-9-]+$/, 'O endereço deve conter apenas letras minúsculas, números e traços')
    .refine((val) => !SLUGS_RESERVADOS.includes(val), {
      message: 'Este endereço é reservado pelo sistema e não pode ser utilizado',
    }),
  nome: z
    .string({ required_error: 'O nome do perfil é obrigatório' })
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(120, 'O nome deve ter no máximo 120 caracteres')
    .trim(),
  descricao: z.string().max(500, 'A descrição pode ter no máximo 500 caracteres').optional(),
  permiteIndexacao: z.boolean().default(true),
});
