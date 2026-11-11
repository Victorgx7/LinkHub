import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const remetentePadrao = process.env.EMAIL_REMETENTE || 'LinkHub <nao-responda@example.com>';

/**
 * Envia um e-mail de convite para um novo proprietário de perfil.
 * Em desenvolvimento local, exibe o link diretamente no terminal.
 * 
 * @param {Object} params
 * @param {string} params.para - E-mail do destinatário
 * @param {string} params.nomePerfil - Nome do perfil atribuído
 * @param {string} params.linkConvite - URL completa de ativação
 */
export async function enviarEmailConvite({ para, nomePerfil, linkConvite }) {
  if (!resend) {
    console.log('\n================== [SIMULAÇÃO DE E-MAIL: CONVITE] ==================');
    console.log(`Para: ${para}`);
    console.log(`Assunto: Você foi convidado para gerenciar o perfil "${nomePerfil}" no LinkHub`);
    console.log(`Link de Ativação: ${linkConvite}`);
    console.log('Validade: 48 horas');
    console.log('===================================================================\n');
    return { sucesso: true, simulado: true };
  }

  try {
    const resposta = await resend.emails.send({
      from: remetentePadrao,
      to: para,
      subject: `Convite para gerenciar o perfil "${nomePerfil}" no LinkHub`,
      html: `
        <div style="font-family: sans-serif; background: #09090B; color: #F4F4F5; padding: 32px; border-radius: 16px;">
          <h2 style="color: #B2FF00; margin-bottom: 8px;">Bem-vindo ao LinkHub</h2>
          <p style="color: #A1A1AA; font-size: 16px;">Você recebeu acesso para gerenciar o perfil <strong>${nomePerfil}</strong>.</p>
          <div style="margin: 28px 0;">
            <a href="${linkConvite}" style="background: #B2FF00; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Ativar Minha Conta e Criar Senha
            </a>
          </div>
          <p style="font-size: 13px; color: #71717A;">Este link expira em 48 horas. Se você não esperava este e-mail, ignore-o com segurança.</p>
        </div>
      `,
    });
    return { sucesso: true, id: resposta.data?.id };
  } catch (erro) {
    console.error('Falha ao enviar e-mail com Resend:', erro);
    return { sucesso: false, erro: erro.message };
  }
}

/**
 * Envia um e-mail com link para recuperação de senha.
 * 
 * @param {Object} params
 * @param {string} params.para - E-mail do usuário
 * @param {string} params.linkRecuperacao - URL com token temporário
 */
export async function enviarEmailRecuperacaoSenha({ para, linkRecuperacao }) {
  if (!resend) {
    console.log('\n============= [SIMULAÇÃO DE E-MAIL: RECUPERAÇÃO DE SENHA] =============');
    console.log(`Para: ${para}`);
    console.log(`Assunto: Recuperação de Senha — LinkHub`);
    console.log(`Link para Redefinir: ${linkRecuperacao}`);
    console.log('Validade: 1 hora');
    console.log('========================================================================\n');
    return { sucesso: true, simulado: true };
  }

  try {
    const resposta = await resend.emails.send({
      from: remetentePadrao,
      to: para,
      subject: 'Recuperação de Senha — LinkHub',
      html: `
        <div style="font-family: sans-serif; background: #09090B; color: #F4F4F5; padding: 32px; border-radius: 16px;">
          <h2 style="color: #B2FF00; margin-bottom: 8px;">Recuperação de Senha</h2>
          <p style="color: #A1A1AA; font-size: 16px;">Recebemos uma solicitação para redefinir sua senha no LinkHub.</p>
          <div style="margin: 28px 0;">
            <a href="${linkRecuperacao}" style="background: #B2FF00; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Redefinir Minha Senha
            </a>
          </div>
          <p style="font-size: 13px; color: #71717A;">Este link expira em 1 hora. Se você não solicitou, nenhuma alteração foi realizada.</p>
        </div>
      `,
    });
    return { sucesso: true, id: resposta.data?.id };
  } catch (erro) {
    console.error('Falha ao enviar e-mail de recuperação:', erro);
    return { sucesso: false, erro: erro.message };
  }
}
