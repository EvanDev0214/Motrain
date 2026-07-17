CREATE TYPE "public"."rpe" AS ENUM('6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10');--> statement-breakpoint
CREATE TYPE "public"."set_type" AS ENUM('warmup', 'formal', 'decrease', 'superset');--> statement-breakpoint
CREATE TABLE "sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_exercise_id" uuid NOT NULL,
	"order" integer DEFAULT 1 NOT NULL,
	"set_type" "set_type" NOT NULL,
	"weight" numeric(6, 2),
	"weight_left" numeric(6, 2),
	"weight_right" numeric(6, 2),
	"reps" integer,
	"rpe" "rpe",
	"note" text,
	"rest_seconds" integer,
	CONSTRAINT "sets_workout_exercise_id_order_unique" UNIQUE("workout_exercise_id","order")
);
--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_workout_exercise_id_workout_exercises_id_fk" FOREIGN KEY ("workout_exercise_id") REFERENCES "public"."workout_exercises"("id") ON DELETE cascade ON UPDATE no action;