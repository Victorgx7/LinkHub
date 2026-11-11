import crypto from 'crypto';
import { hash, verify } from '@node-rs/argon2';

/**
 * Opções de configuração para o algoritmo Argon2id
 * Recomendado pelas normas OWASP para hashing de senhas de alta segurança.
 */
const OPCOES_ARGON2 = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,       // 2 iterações
  outputLen: 32,
  parallelism: 1,
};

/**
 * Gera um hash seguro da senha utilizando Argon2id.
 * 
 * @param {string} senha - Senha em texto puro
 * @returns {Promise<string>} Hash criptográfico formatado
 */
export async function gerarHashSenha(senha) {
  if (!senha || typeof senha !== 'string') {
    throw new Error('A senha deve ser uma string válida');
  }
  return await hash(senha, OPCOES_ARGON2);
}

/**
 * Valida se uma senha em texto puro coincide com o hash Argon2id armazenado.
 * 
 * @param {string} senha - Senha fornecida
 * @param {string} hashArmazenado - Hash armazenado no banco
 * @returns {Promise<boolean>} Verdadeiro se coincidir
 */
export async function verificarSenha(senha, hashArmazenado) {
  if (!senha || !hashArmazenado) return false;
  try {
    return await verify(hashArmazenado, senha);
  } catch (erro) {
    console.error('Erro na validação de hash Argon2id:', erro);
    return false;
  }
}

/**
 * Gera um token aleatório criptograficamente seguro (em hexadecimal).
 * 
 * @param {number} [bytes=32] - Quantidade de bytes de entropia
 * @returns {string} Token em formato hexadecimal
 */
export function gerarTokenAleatorio(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Gera o hash SHA-256 de um token para persistência segura no banco de dados.
 * O token bruto é enviado apenas no cookie ou link temporário; o banco armazena apenas o hash.
 * 
 * @param {string} token - Token bruto
 * @returns {string} Hash SHA-256 em hexadecimal
 */
export function gerarHashToken(token) {
  if (!token) return '';
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Anonimiza um endereço IP utilizando hash saltado diário, em conformidade com a LGPD.
 * O IP real do usuário nunca é persistido de forma reversível.
 * 
 * @param {string} ip - Endereço IP original (IPv4 ou IPv6)
 * @param {string} [saltOpcional] - Salt do dia
 * @returns {string} Identificador anonimizado
 */
export function anonimizarIp(ip, saltOpcional) {
  if (!ip) return 'desconhecido';
  const dataHoje = new Date().toISOString().slice(0, 10);
  const salt = saltOpcional || process.env.SESSAO_SECRETO;
  if (!salt) {
    throw new Error('SESSAO_SECRETO deve estar configurado para anonimizar endereços IP.');
  }
  return crypto.createHash('sha256').update(`${ip}-${dataHoje}-${salt}`).digest('hex').slice(0, 32);
}
