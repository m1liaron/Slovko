DROP TYPE IF EXISTS part_of_speech;
CREATE TYPE part_of_speech AS ENUM (
    'noun', 'verb', 'adjective', 'adverb', 'pronoun',
    'preposition', 'conjunction', 'interjection', 'article', 'determiner'
);
CREATE TABLE "antonyms" (
	"id" serial PRIMARY KEY NOT NULL,
	"sense_id" integer NOT NULL,
	"word" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collocations" (
	"id" serial PRIMARY KEY NOT NULL,
	"sense_id" integer NOT NULL,
	"collocation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deck_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck_id" uuid NOT NULL,
	"headword_id" integer NOT NULL,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"language_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"level" text NOT NULL,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "examples" (
	"id" serial PRIMARY KEY NOT NULL,
	"sense_id" integer NOT NULL,
	"sentence" text NOT NULL,
	"definition" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "headwords" (
	"id" serial PRIMARY KEY NOT NULL,
	"language_id" integer NOT NULL,
	"word" text NOT NULL,
	"pos" "part_of_speech" NOT NULL,
	"level" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idioms" (
	"id" serial PRIMARY KEY NOT NULL,
	"sense_id" integer NOT NULL,
	"idiom" text NOT NULL,
	"definition" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "phrases" (
	"id" serial PRIMARY KEY NOT NULL,
	"sense_id" integer NOT NULL,
	"phrase" text NOT NULL,
	"definition" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "senses" (
	"id" serial PRIMARY KEY NOT NULL,
	"headword_id" integer NOT NULL,
	"definition" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "synonyms" (
	"id" serial PRIMARY KEY NOT NULL,
	"sense_id" integer NOT NULL,
	"synonym" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "antonyms" ADD CONSTRAINT "antonyms_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collocations" ADD CONSTRAINT "collocations_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_words" ADD CONSTRAINT "deck_words_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_words" ADD CONSTRAINT "deck_words_headword_id_headwords_id_fk" FOREIGN KEY ("headword_id") REFERENCES "public"."headwords"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decks" ADD CONSTRAINT "decks_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examples" ADD CONSTRAINT "examples_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "headwords" ADD CONSTRAINT "headwords_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idioms" ADD CONSTRAINT "idioms_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phrases" ADD CONSTRAINT "phrases_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "senses" ADD CONSTRAINT "senses_headword_id_headwords_id_fk" FOREIGN KEY ("headword_id") REFERENCES "public"."headwords"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "synonyms" ADD CONSTRAINT "synonyms_sense_id_senses_id_fk" FOREIGN KEY ("sense_id") REFERENCES "public"."senses"("id") ON DELETE cascade ON UPDATE no action;