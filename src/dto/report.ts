export interface ReportDto {
    _id?: string;
    reportType?: any;
    file?: string;
    json?: string;
    reportingDate?: string | any;
    startDate?: string | any;
    endDate?: string;
    createdBy?: string;
    updatedBy?: string;
    approvedBy?: string;
    status?: string | any;
    response?: string | any;
    createdAt?: Date;
    updatedAt?: Date;
}
