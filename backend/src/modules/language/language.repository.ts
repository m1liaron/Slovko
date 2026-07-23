import { db } from "@/db"
import { languages, NewLanguage } from "./language.model"
import { eq } from "drizzle-orm"
import { Language } from "unsplash-js";

const LanguageRepository = {
    async findByCode(code: string){
        return db.query.languages.findFirst({
            where: eq(languages.code, code)
        });
    },

    async create(data: NewLanguage): Promise<NewLanguage> {
        const [language] = await db.insert(languages).values(data).returning()
        return language;
    }
}

export { LanguageRepository };