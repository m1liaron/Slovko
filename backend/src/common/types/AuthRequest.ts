interface AuthRequest extends Request {
    user: {
        id: string;
        name: string;
    }
}

export { AuthRequest };