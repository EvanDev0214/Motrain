CREATE TYPE "public"."muscle_role" AS ENUM('primary', 'secondary');--> statement-breakpoint
CREATE TABLE "exercise_muscles" (
	"exercise_id" uuid NOT NULL,
	"muscle_id" uuid NOT NULL,
	"muscleRole" "muscle_role" NOT NULL,
	CONSTRAINT "exercise_muscles_exercise_id_muscle_id_pk" PRIMARY KEY("exercise_id","muscle_id")
);
--> statement-breakpoint
ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_muscle_id_muscles_id_fk" FOREIGN KEY ("muscle_id") REFERENCES "public"."muscles"("id") ON DELETE cascade ON UPDATE no action;