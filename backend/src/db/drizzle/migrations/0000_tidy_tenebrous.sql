CREATE TYPE "public"."card_status" AS ENUM('To Learn', 'Repeated', 'Know', 'Learned');--> statement-breakpoint
CREATE TYPE "public"."result_mode" AS ENUM('flashCards', 'quiz', 'guessWord', 'checkTranslate');--> statement-breakpoint
CREATE TABLE "Cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"word" varchar(60) NOT NULL,
	"translate_word" varchar(100) NOT NULL,
	"group_id" uuid NOT NULL,
	"image_id" uuid,
	"status" "card_status" DEFAULT 'To Learn' NOT NULL,
	"definition" text DEFAULT '' NOT NULL,
	"example" text DEFAULT '' NOT NULL,
	"learned_at" timestamp with time zone,
	"next_review_at" timestamp with time zone,
	"review_count" integer DEFAULT 0 NOT NULL,
	"sense_id" integer
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"language_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"level" text NOT NULL,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Groups" (
	"title" varchar(30) NOT NULL,
	"section_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"code" varchar(10) NOT NULL,
	"symbol" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ResultsMode" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"mode" "result_mode" NOT NULL,
	"result_id" uuid
);
--> statement-breakpoint
CREATE TABLE "WordsResult" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"result_mode_id" uuid,
	"word" varchar(255) NOT NULL,
	"translate" varchar(255) NOT NULL,
	"mistakes_amount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"started_learn" timestamp with time zone NOT NULL,
	"completion_time" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Sections" (
	"title" varchar(255) NOT NULL,
	"language_id" uuid,
	"user_id" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SharedCards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"word" varchar(30) NOT NULL,
	"translate_word" varchar(100) NOT NULL,
	"shared_group_id" uuid
);
--> statement-breakpoint
CREATE TABLE "SharedCardLike" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"shared_group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SharedGroups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" varchar(30) NOT NULL,
	"user_id" uuid NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"words_length" integer NOT NULL,
	CONSTRAINT "SharedGroups_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "Streaks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"frozen" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"image" text,
	"streak" integer DEFAULT 0 NOT NULL,
	"last_review_at" timestamp with time zone DEFAULT now() NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"frozen" boolean DEFAULT false NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_group_id_Groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."Groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_image_id_Images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."Images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decks" ADD CONSTRAINT "decks_language_id_Languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."Languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_section_id_Sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."Sections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ResultsMode" ADD CONSTRAINT "ResultsMode_result_id_Results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."Results"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WordsResult" ADD CONSTRAINT "WordsResult_result_mode_id_ResultsMode_id_fk" FOREIGN KEY ("result_mode_id") REFERENCES "public"."ResultsMode"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Results" ADD CONSTRAINT "Results_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sections" ADD CONSTRAINT "Sections_language_id_Languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."Languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sections" ADD CONSTRAINT "Sections_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SharedCards" ADD CONSTRAINT "SharedCards_shared_group_id_SharedGroups_id_fk" FOREIGN KEY ("shared_group_id") REFERENCES "public"."SharedGroups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SharedCardLike" ADD CONSTRAINT "SharedCardLike_shared_group_id_SharedGroups_id_fk" FOREIGN KEY ("shared_group_id") REFERENCES "public"."SharedGroups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SharedCardLike" ADD CONSTRAINT "SharedCardLike_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SharedGroups" ADD CONSTRAINT "SharedGroups_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Streaks" ADD CONSTRAINT "Streaks_user_id_Users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;