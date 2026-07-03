import bcrypt from 'bcrypt';

class Encrypt {
    #saltRounds: number;

    public constructor(salt_rounds: number) {
        this.#saltRounds = salt_rounds;
    }

    public compare(firstValue: string, secondValue: string): Promise<boolean> {
        return bcrypt.compare(firstValue, secondValue);
    }

    public hash(value: string): Promise<string> {
        return bcrypt.hash(value, this.#saltRounds);
    }
}

export { Encrypt };
