export interface UserDto {
    id?: string;
    email?: string;
    role?: string;
    allowedReports?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    createdBy?: string;
}
