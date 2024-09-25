export type customError = {
    status: number,
    message: string,
    code: customErrorCode;
}

export enum customErrorCode {
    USERS_NOT_EXIST = "USERS_NOT_EXIST",
    THREAD_NOT_EXIST = "THREAD_NOT_EXIST",
    FOLLOW_NOT_EXIST = "FOLLOW_NOT_EXIST",
}