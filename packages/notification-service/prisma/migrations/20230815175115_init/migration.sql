-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Address" (
    "address" TEXT NOT NULL,
    "withdrawerId" INTEGER NOT NULL,
    CONSTRAINT "Address_withdrawerId_fkey" FOREIGN KEY ("withdrawerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionId" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "addressId" TEXT NOT NULL,
    CONSTRAINT "Transaction_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Address_address_key" ON "Address"("address");
