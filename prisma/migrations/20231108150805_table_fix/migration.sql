/*
  Warnings:

  - You are about to drop the `ruin_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `ruin_user`;

-- CreateTable
CREATE TABLE `ruin_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `pass` VARCHAR(99) NOT NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
