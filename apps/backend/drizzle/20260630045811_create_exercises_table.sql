CREATE TYPE "public"."default_weight_mode" AS ENUM('single', 'bilateral');--> statement-breakpoint
CREATE TYPE "public"."equipment" AS ENUM('barbell', 'dumbbell', 'cable', 'smith_machine', 'machine', 'plate_loaded_machine', 'kettlebell', 'bodyweight', 'other');--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"is_system" boolean DEFAULT false NOT NULL,
	"name" varchar(64) NOT NULL,
	"equipment" "equipment" NOT NULL,
	"defaultWeightMode" "default_weight_mode" DEFAULT 'single' NOT NULL,
	"media_url" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;