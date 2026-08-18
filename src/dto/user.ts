export interface UserDto {
    _id?: string;
    email?: string;
    role?: string;
    allowedReports?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    createdBy?: string;
}
