-- CreateTable
CREATE TABLE "produtores" (
    "id" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propriedades" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "areaTotal" DOUBLE PRECISION NOT NULL,
    "areaAgricultavel" DOUBLE PRECISION NOT NULL,
    "areaVegetacao" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "produtorId" TEXT NOT NULL,

    CONSTRAINT "propriedades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safras" (
    "id" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "propriedadeId" TEXT NOT NULL,

    CONSTRAINT "safras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "culturas_plantadas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "safraId" TEXT NOT NULL,

    CONSTRAINT "culturas_plantadas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "produtores_documento_key" ON "produtores"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "safras_propriedadeId_ano_key" ON "safras"("propriedadeId", "ano");

-- AddForeignKey
ALTER TABLE "propriedades" ADD CONSTRAINT "propriedades_produtorId_fkey" FOREIGN KEY ("produtorId") REFERENCES "produtores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safras" ADD CONSTRAINT "safras_propriedadeId_fkey" FOREIGN KEY ("propriedadeId") REFERENCES "propriedades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "culturas_plantadas" ADD CONSTRAINT "culturas_plantadas_safraId_fkey" FOREIGN KEY ("safraId") REFERENCES "safras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
