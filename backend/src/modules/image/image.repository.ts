import { db } from "@/db";
import { images, NewImage } from "./image.model";
import { Transaction } from "@/db/drizzle";

const ImageRepository = {
    async create(data: NewImage, tx: Transaction = db) {
        const [section] = await tx.insert(images).values(data).returning();
        return section;
    }
}

export { ImageRepository };