import { PrismaClient, PapelUsuario, PapelPerfil } from '@prisma/client';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient();

const OPCOES_ARGON2 = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

async function seed() {
  console.log('Iniciando carga de dados padrão (Seed)...');

  const emailAdmin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senhaAdmin = process.env.ADMIN_PASSWORD;
  if (!emailAdmin || !senhaAdmin) {
    throw new Error(
      'ADMIN_EMAIL e ADMIN_PASSWORD devem estar configurados antes de executar o seed.'
    );
  }
  if (senhaAdmin.length < 8) {
    throw new Error('ADMIN_PASSWORD deve conter pelo menos 8 caracteres.');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // 1. Cria ou recupera o Administrador Principal
  let admin = await prisma.usuario.findUnique({
    where: { email: emailAdmin },
  });

  if (!admin) {
    const senhaHash = await hash(senhaAdmin, OPCOES_ARGON2);
    admin = await prisma.usuario.create({
      data: {
        nome: 'Administrador LinkHub',
        email: emailAdmin,
        senhaHash,
        papel: PapelUsuario.ADMINISTRADOR_PRINCIPAL,
        limitePerfis: 999,
        ativo: true,
      },
    });
    console.log(`✓ Administrador criado: ${emailAdmin}`);
  } else {
    console.log(`ℹ Administrador já existe: ${emailAdmin}`);
  }

  // 2. Cria ou recupera o perfil público de demonstração
  let perfilDemo = await prisma.perfil.findUnique({
    where: { slug: 'demo' },
  });

  if (!perfilDemo) {
    perfilDemo = await prisma.perfil.create({
      data: {
        slug: 'demo',
        nome: 'LinkHub Oficial',
        descricao: 'Página oficial de demonstração da plataforma LinkHub. Conecte todos os seus links em um só lugar.',
        ativo: true,
        permiteIndexacao: true,
        tituloSeo: 'LinkHub — Perfil Demonstrativo',
        descricaoSeo: 'Conheça o visual SaaS moderno do LinkHub.',
        configuracaoVisual: {
          create: {
            temaPredefinido: 'padrao',
            corFundo: '#09090B',
            corDestaque: '#B2FF00',
            corTexto: '#FFFFFF',
            corBorda: 'rgba(255, 255, 255, 0.12)',
            estiloBotao: 'outline',
            arredondamentoBotao: 'rounded-xl',
            fonteFamilia: 'sans',
            efeitoVidro: true,
            efeitoAurora: true,
          },
        },
        links: {
          create: [
            {
              titulo: 'Acessar Plataforma Oficial',
              url: appUrl,
              icone: 'globe',
              servicoDetectado: 'website',
              ordem: 0,
              ativo: true,
              destaque: true,
            },
            {
              titulo: 'Siga no Instagram',
              url: 'https://instagram.com/linkhub',
              icone: 'instagram',
              servicoDetectado: 'instagram',
              ordem: 1,
              ativo: true,
            },
            {
              titulo: 'Fale Conosco no WhatsApp',
              url: 'https://wa.me/5511999999999',
              icone: 'message-circle',
              servicoDetectado: 'whatsapp',
              ordem: 2,
              ativo: true,
            },
          ],
        },
      },
    });

    // Vincula a permissão do Administrador sobre o perfil
    await prisma.permissaoPerfil.create({
      data: {
        usuarioId: admin.id,
        perfilId: perfilDemo.id,
        papel: PapelPerfil.PROPRIETARIO,
      },
    });

    console.log('✓ Perfil de demonstração "/demo" criado com sucesso.');
  }

  console.log('Seed concluído com sucesso!');
}

seed()
  .catch((erro) => {
    console.error('Erro durante execução do seed:', erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
