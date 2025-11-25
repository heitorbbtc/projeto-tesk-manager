/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TasksHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_team_id_fkey";

-- DropForeignKey
ALTER TABLE "TasksHistory" DROP CONSTRAINT "TasksHistory_changed_by_fkey";

-- DropForeignKey
ALTER TABLE "TasksHistory" DROP CONSTRAINT "TasksHistory_task_id_fkey";

-- DropForeignKey
ALTER TABLE "TeamMembers" DROP CONSTRAINT "TeamMembers_team_id_fkey";

-- DropForeignKey
ALTER TABLE "TeamMembers" DROP CONSTRAINT "TeamMembers_user_id_fkey";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "TasksHistory";

-- DropTable
DROP TABLE "TeamMembers";

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TaskRole" NOT NULL DEFAULT 'pending',
    "priority" "PriorityRole" NOT NULL DEFAULT 'high',
    "assigned_to" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks_history" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "changed_by" TEXT NOT NULL,
    "old_status" "TaskRole" NOT NULL,
    "new_status" "TaskRole" NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks_history" ADD CONSTRAINT "tasks_history_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks_history" ADD CONSTRAINT "tasks_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
