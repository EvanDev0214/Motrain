CREATE TABLE "email_verify_otps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(6) NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "email_verify_otps_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "email_verify_otps_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "email_verify_otps" ADD CONSTRAINT "email_verify_otps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;