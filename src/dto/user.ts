export interface UserDto {
    _id?: string;
    email?: string;
    role?: string;
    allowedReports?: string[] | any[];
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    createdBy?: string;
}
