ALTER TABLE "exercise_muscles" DROP CONSTRAINT "exercise_muscles_muscle_id_muscles_id_fk";
--> statement-breakpoint
ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_muscle_id_muscles_id_fk" FOREIGN KEY ("muscle_id") REFERENCES "public"."muscles"("id") ON DELETE restrict ON UPDATE no action;