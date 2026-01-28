ALTER TYPE "public"."part_of_speech" ADD VALUE 'auxiliary verb';--> statement-breakpoint
ALTER TABLE "headwords" ADD CONSTRAINT "headwords_word_unique" UNIQUE("word");