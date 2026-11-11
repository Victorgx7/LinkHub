-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senhaHash` VARCHAR(255) NOT NULL,
    `papel` ENUM('ADMINISTRADOR_PRINCIPAL', 'PROPRIETARIO') NOT NULL DEFAULT 'PROPRIETARIO',
    `limitePerfis` INTEGER NOT NULL DEFAULT 3,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,
    `excluidoEm` DATETIME(3) NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    INDEX `usuarios_email_idx`(`email`),
    INDEX `usuarios_excluidoEm_idx`(`excluidoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfis` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(80) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `descricao` VARCHAR(500) NULL,
    `fotoUrl` VARCHAR(255) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `permiteIndexacao` BOOLEAN NOT NULL DEFAULT true,
    `tituloSeo` VARCHAR(120) NULL,
    `descricaoSeo` VARCHAR(255) NULL,
    `imagemCompartilhamento` VARCHAR(255) NULL,
    `visualizacoesTotais` INTEGER NOT NULL DEFAULT 0,
    `cliquesTotais` INTEGER NOT NULL DEFAULT 0,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,
    `excluidoEm` DATETIME(3) NULL,

    UNIQUE INDEX `perfis_slug_key`(`slug`),
    INDEX `perfis_slug_idx`(`slug`),
    INDEX `perfis_ativo_excluidoEm_idx`(`ativo`, `excluidoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissoes_perfil` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `perfilId` VARCHAR(191) NOT NULL,
    `papel` ENUM('PROPRIETARIO', 'EDITOR') NOT NULL DEFAULT 'PROPRIETARIO',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `permissoes_perfil_usuarioId_idx`(`usuarioId`),
    INDEX `permissoes_perfil_perfilId_idx`(`perfilId`),
    UNIQUE INDEX `permissoes_perfil_usuarioId_perfilId_key`(`usuarioId`, `perfilId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `links` (
    `id` VARCHAR(191) NOT NULL,
    `perfilId` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(120) NOT NULL,
    `url` VARCHAR(1000) NOT NULL,
    `icone` VARCHAR(50) NULL,
    `servicoDetectado` VARCHAR(50) NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `destaque` BOOLEAN NOT NULL DEFAULT false,
    `cliquesTotais` INTEGER NOT NULL DEFAULT 0,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,
    `excluidoEm` DATETIME(3) NULL,

    INDEX `links_perfilId_ordem_idx`(`perfilId`, `ordem`),
    INDEX `links_perfilId_ativo_excluidoEm_idx`(`perfilId`, `ativo`, `excluidoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configuracoes_visuais` (
    `id` VARCHAR(191) NOT NULL,
    `perfilId` VARCHAR(191) NOT NULL,
    `temaPredefinido` VARCHAR(50) NOT NULL DEFAULT 'padrao',
    `corFundo` VARCHAR(20) NOT NULL DEFAULT '#09090B',
    `corDestaque` VARCHAR(20) NOT NULL DEFAULT '#B2FF00',
    `corTexto` VARCHAR(20) NOT NULL DEFAULT '#FFFFFF',
    `corBorda` VARCHAR(40) NOT NULL DEFAULT 'rgba(255, 255, 255, 0.12)',
    `estiloBotao` VARCHAR(30) NOT NULL DEFAULT 'outline',
    `arredondamentoBotao` VARCHAR(30) NOT NULL DEFAULT 'rounded-xl',
    `fonteFamilia` VARCHAR(50) NOT NULL DEFAULT 'sans',
    `efeitoVidro` BOOLEAN NOT NULL DEFAULT true,
    `efeitoAurora` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `configuracoes_visuais_perfilId_key`(`perfilId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessoes` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(64) NOT NULL,
    `ipAnonimizado` VARCHAR(64) NULL,
    `userAgent` VARCHAR(255) NULL,
    `expiraEm` DATETIME(3) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sessoes_tokenHash_key`(`tokenHash`),
    INDEX `sessoes_usuarioId_idx`(`usuarioId`),
    INDEX `sessoes_tokenHash_idx`(`tokenHash`),
    INDEX `sessoes_expiraEm_idx`(`expiraEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `convites` (
    `id` VARCHAR(191) NOT NULL,
    `perfilId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(64) NOT NULL,
    `expiraEm` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NOT NULL DEFAULT false,
    `criadoPorId` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `convites_tokenHash_key`(`tokenHash`),
    INDEX `convites_email_idx`(`email`),
    INDEX `convites_tokenHash_idx`(`tokenHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens_recuperacao_senha` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(64) NOT NULL,
    `expiraEm` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NOT NULL DEFAULT false,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tokens_recuperacao_senha_tokenHash_key`(`tokenHash`),
    INDEX `tokens_recuperacao_senha_tokenHash_idx`(`tokenHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventos_acesso` (
    `id` VARCHAR(191) NOT NULL,
    `perfilId` VARCHAR(191) NOT NULL,
    `linkId` VARCHAR(191) NULL,
    `tipoEvento` ENUM('VISUALIZACAO', 'CLIQUE') NOT NULL,
    `identificadorAnonimo` VARCHAR(64) NOT NULL,
    `dispositivo` ENUM('MOBILE', 'TABLET', 'DESKTOP', 'OUTRO') NOT NULL DEFAULT 'OUTRO',
    `navegador` VARCHAR(50) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `eventos_acesso_perfilId_criadoEm_idx`(`perfilId`, `criadoEm`),
    INDEX `eventos_acesso_linkId_criadoEm_idx`(`linkId`, `criadoEm`),
    INDEX `eventos_acesso_tipoEvento_criadoEm_idx`(`tipoEvento`, `criadoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historicos_alteracao` (
    `id` VARCHAR(191) NOT NULL,
    `perfilId` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `versao` INTEGER NOT NULL,
    `dadosJson` LONGTEXT NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `historicos_alteracao_perfilId_versao_idx`(`perfilId`, `versao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `registros_auditoria` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NULL,
    `acao` VARCHAR(80) NOT NULL,
    `entidade` VARCHAR(60) NOT NULL,
    `entidadeId` VARCHAR(64) NULL,
    `detalhesJson` TEXT NULL,
    `ipAnonimizado` VARCHAR(64) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `registros_auditoria_usuarioId_criadoEm_idx`(`usuarioId`, `criadoEm`),
    INDEX `registros_auditoria_acao_criadoEm_idx`(`acao`, `criadoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `permissoes_perfil` ADD CONSTRAINT `permissoes_perfil_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissoes_perfil` ADD CONSTRAINT `permissoes_perfil_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `perfis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `links` ADD CONSTRAINT `links_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `perfis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `configuracoes_visuais` ADD CONSTRAINT `configuracoes_visuais_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `perfis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessoes` ADD CONSTRAINT `sessoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `convites` ADD CONSTRAINT `convites_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `perfis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `convites` ADD CONSTRAINT `convites_criadoPorId_fkey` FOREIGN KEY (`criadoPorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tokens_recuperacao_senha` ADD CONSTRAINT `tokens_recuperacao_senha_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventos_acesso` ADD CONSTRAINT `eventos_acesso_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `perfis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventos_acesso` ADD CONSTRAINT `eventos_acesso_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `links`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historicos_alteracao` ADD CONSTRAINT `historicos_alteracao_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `perfis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historicos_alteracao` ADD CONSTRAINT `historicos_alteracao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registros_auditoria` ADD CONSTRAINT `registros_auditoria_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
