CREATE TABLE "body_weights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"weight" numeric(6, 2) NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "body_weights_user_id_recorded_at_unique" UNIQUE("user_id","recorded_at")
);
--> statement-breakpoint
ALTER TABLE "body_weights" ADD CONSTRAINT "body_weights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;