export type createUsersDTO = {
    username: string;
    fullName: string;
    email: string;
    passwordUsers: string;
    image?: string | null;
    backgroundImage?: string | null
    bio: string
};

export type editUsersDTO = Omit<createUsersDTO, "email">

