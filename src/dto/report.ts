export interface ReportDto {
    _id?: string;
    reportType?: any;
    file?: string;
    json?: string;
    reportingDate?: string;
    startDate?: string;
    endDate?: string;
    createdBy?: string;
    updatedBy?: string;
    approvedBy?: string;
    status?: string | any;
    response?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
