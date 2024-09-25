-- CreateTable
CREATE TABLE "Suggestion" (
    "id" SERIAL NOT NULL,
    "suggestedById" INTEGER NOT NULL,
    "suggestedToId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_suggestedById_fkey" FOREIGN KEY ("suggestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_suggestedToId_fkey" FOREIGN KEY ("suggestedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
