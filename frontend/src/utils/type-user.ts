export type User = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}

export type createUser = {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

export type loginUser = {
    email: string;
    password: string;
}