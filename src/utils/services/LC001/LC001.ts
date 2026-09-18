// @ts-nocheck
import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";

const LC001_ITEM_DEFINITIONS = [
    { code: "122_00001", description: "Pass (Sum 1.1-1.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00002", description: "Pass (Sum 1.1-1.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00003", description: "Pass (Sum 1.1-1.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00004", description: "Pass (Sum 1.1-1.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00005", description: "Pass (Sum 1.1-1.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00006", description: "Pass (Sum 1.1-1.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00007", description: "Pass (Sum 1.1-1.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00008", description: "Pass (Sum 1.1-1.4)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00009", description: "Pass (Sum 1.1-1.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00010", description: "1.1 Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00011", description: "1.1 Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00012", description: "1.1 Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00013", description: "1.1 Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00014", description: "1.1 Term loan_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00015", description: "1.1 Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00016", description: "1.1 Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00017", description: "1.1 Term loan_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00018", description: "1.1 Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00019", description: "1.2 Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00020", description: "1.2 Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00021", description: "1.2 Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00022", description: "1.2 Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00023", description: "1.2 Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00024", description: "1.2 Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00025", description: "1.2 Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00026", description: "1.2 Overdraft_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00027", description: "1.2 Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00028", description: "1.3 Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00029", description: "1.3 Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00030", description: "1.3 Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00031", description: "1.3 Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00032", description: "1.3 Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00033", description: "1.3 Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00034", description: "1.3 Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00035", description: "1.3 Merchandize_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00036", description: "1.3 Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00037", description: "1.4 others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00038", description: "1.4 others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00039", description: "1.4 others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00040", description: "1.4 others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00041", description: "1.4 others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00042", description: "1.4 others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00043", description: "1.4 others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00044", description: "1.4 others_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00045", description: "1.4 others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00046", description: "Special mention (Sum 2.1-2.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00047", description: "Special mention (Sum 2.1-2.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00048", description: "Special mention (Sum 2.1-2.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00049", description: "Special mention (Sum 2.1-2.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00050", description: "Special mention (Sum 2.1-2.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00051", description: "Special mention (Sum 2.1-2.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00052", description: "Special mention (Sum 2.1-2.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00053", description: "Special mention (Sum 2.1-2.4)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00054", description: "Special mention (Sum 2.1-2.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00055", description: "Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00056", description: "Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00057", description: "Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00058", description: "Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00059", description: "Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00060", description: "Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00061", description: "Term loan_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00062", description: "Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00063", description: "Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00064", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00065", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00066", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00067", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00068", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00069", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00070", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00071", description: "Overdraft_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00072", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00073", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00074", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00075", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00076", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00077", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00078", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00079", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00080", description: "Merchandize_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00081", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00082", description: "others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00083", description: "others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00084", description: "others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00085", description: "others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00086", description: "others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00087", description: "others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00088", description: "others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00089", description: "others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00090", description: "others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00091", description: "Substandard (3.1+3.2)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00092", description: "Substandard (3.1+3.2)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00093", description: "Substandard (3.1+3.2)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00094", description: "Substandard (3.1+3.2)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00095", description: "Substandard (3.1+3.2)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00096", description: "Substandard (3.1+3.2)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00097", description: "Substandard (3.1+3.2)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00098", description: "Substandard (3.1+3.2)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00099", description: "Substandard (3.1+3.2)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00100", description: "Renegotiated (Sum 3.1.1-3.1.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00101", description: "Renegotiated (Sum 3.1.1-3.1.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00102", description: "Renegotiated (Sum 3.1.1-3.1.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00103", description: "Renegotiated (Sum 3.1.1-3.1.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00104", description: "Renegotiated (Sum 3.1.1-3.1.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00105", description: "Renegotiated (Sum 3.1.1-3.1.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00106", description: "Renegotiated (Sum 3.1.1-3.1.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00107", description: "Renegotiated (Sum 3.1.1-3.1.4)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00108", description: "Renegotiated (Sum 3.1.1-3.1.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00109", description: "Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00110", description: "Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00111", description: "Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00112", description: "Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00113", description: "Term loan_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00114", description: "Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00115", description: "Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00116", description: "Term loan_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00117", description: "Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00118", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00119", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00120", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00121", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00122", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00123", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00124", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00125", description: "Overdraft_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00126", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00127", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00128", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00129", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00130", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00131", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00132", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00133", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00134", description: "Merchandize_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00135", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00136", description: "Others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00137", description: "Others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00138", description: "Others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00139", description: "Others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00140", description: "Others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00141", description: "Others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00142", description: "Others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00143", description: "Others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00144", description: "Others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00145", description: "Non-Renegotiated_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00146", description: "Non-Renegotiated_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00147", description: "Non-Renegotiated_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00148", description: "Non-Renegotiated_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00149", description: "Non-Renegotiated_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00150", description: "Non-Renegotiated_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00151", description: "Non-Renegotiated_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00152", description: "Non-Renegotiated_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00153", description: "Non-Renegotiated_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00154", description: "Term loan (Sum 3.2.1-3.2.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00155", description: "Term loan (Sum 3.2.1-3.2.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00156", description: "Term loan (Sum 3.2.1-3.2.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00157", description: "Term loan (Sum 3.2.1-3.2.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00158", description: "Term loan (Sum 3.2.1-3.2.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00159", description: "Term loan (Sum 3.2.1-3.2.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00160", description: "Term loan (Sum 3.2.1-3.2.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00161", description: "Term loan (Sum 3.2.1-3.2.4)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00162", description: "Term loan (Sum 3.2.1-3.2.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00163", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00164", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00165", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00166", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00167", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00168", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00169", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00170", description: "Overdraft_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00171", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00172", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00173", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00174", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00175", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00176", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00177", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00178", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00179", description: "Merchandize_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00180", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00181", description: "Others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00182", description: "Others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00183", description: "Others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00184", description: "Others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00185", description: "Others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00186", description: "Others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00187", description: "Others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00188", description: "Others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00189", description: "Others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00190", description: "Doubtful (Sum 4.1-4.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00191", description: "Doubtful (Sum 4.1-4.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00192", description: "Doubtful (Sum 4.1-4.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00193", description: "Doubtful (Sum 4.1-4.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00194", description: "Doubtful (Sum 4.1-4.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00195", description: "Doubtful (Sum 4.1-4.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00196", description: "Doubtful (Sum 4.1-4.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00197", description: "Doubtful (Sum 4.1-4.4)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00198", description: "Doubtful (Sum 4.1-4.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00199", description: "Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00200", description: "Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00201", description: "Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00202", description: "Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00203", description: "Term loan_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00204", description: "Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00205", description: "Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00206", description: "Term loan_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00207", description: "Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00208", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00209", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00210", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00211", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00212", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00213", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00214", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00215", description: "Overdraft_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00216", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00217", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00218", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00219", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00220", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00221", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00222", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00223", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00224", description: "Merchandize_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00225", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00226", description: "Others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00227", description: "Others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00228", description: "Others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00229", description: "Others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00230", description: "Others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00231", description: "Others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00232", description: "Others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00233", description: "Others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00234", description: "Others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00235", description: "Loss loans (Sum 5.1-5.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00236", description: "Loss loans (Sum 5.1-5.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00237", description: "Loss loans (Sum 5.1-5.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00238", description: "Loss loans (Sum 5.1-5.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00239", description: "Loss loans (Sum 5.1-5.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00240", description: "Loss loans (Sum 5.1-5.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00241", description: "Loss loans (Sum 5.1-5.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00242", description: "Loss loans (Sum 5.1-5.4)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00243", description: "Loss loans (Sum 5.1-5.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00244", description: "Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00245", description: "Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00246", description: "Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00247", description: "Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00248", description: "Term loan_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00249", description: "Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00250", description: "Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00251", description: "Term loan_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00252", description: "Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00253", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00254", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00255", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00256", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00257", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00258", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00259", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00260", description: "Overdraft_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00261", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00262", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00263", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00264", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00265", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00266", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00267", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00268", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00269", description: "Merchandize_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00270", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00271", description: "others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00272", description: "others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00273", description: "others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00274", description: "others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00275", description: "others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00276", description: "others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00277", description: "others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00278", description: "others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00279", description: "others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00280", description: "Total (Sum 1-5)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00281", description: "Total (Sum 1-5)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00282", description: "Total (Sum 1-5)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00283", description: "Total (Sum 1-5)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00284", description: "Total (Sum 1-5)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00285", description: "Total (Sum 1-5)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00286", description: "Total (Sum 1-5)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00287", description: "Total (Sum 1-5)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00288", description: "Total (Sum 1-5)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00289", description: "Total Non Performing (Sum 3-5)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00290", description: "Total Non Performing (Sum 3-5)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00291", description: "Total Non Performing (Sum 3-5)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00292", description: "Total Non Performing (Sum 3-5)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00293", description: "Total Non Performing (Sum 3-5)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00294", description: "Total Non Performing (Sum 3-5)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00295", description: "Total Non Performing (Sum 3-5)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00296", description: "Total Non Performing (Sum 3-5)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00297", description: "Total Non Performing (Sum 3-5)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00298", description: "NPLs to Total Loans Ratio(7/6)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "122_00299", description: "NPLs to Total Loans Ratio(7/6)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "122_00300", description: "NPLs to Total Loans Ratio(7/6)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "122_00301", description: "NPLs to Total Loans Ratio(7/6)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "122_00302", description: "NPLs to Total Loans Ratio(7/6)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "122_00303", description: "NPLs to Total Loans Ratio(7/6)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "122_00304", description: "NPLs to Total Loans Ratio(7/6)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "122_00305", description: "NPLs to Total Loans Ratio(7/6)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "122_00306", description: "NPLs to Total Loans Ratio(7/6)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "122_00307", description: "Total_Accumulated provision held", dataType: "NUMERIC", required: false }
];

export function processLC001(worksheet, instCode, startDate, endDate) {
    const formatCellVal = (cellVal) => {
        if (cellVal === null || cellVal === undefined) return "";
        if (cellVal instanceof Date) {
            if (isNaN(cellVal.getTime())) return "";
            const pad = (n) => n.toString().padStart(2, "0");
            const yyyy = cellVal.getFullYear();
            const mm = pad(cellVal.getMonth() + 1);
            const dd = pad(cellVal.getDate());
            return `${yyyy}-${mm}-${dd}`;
        }
        if (typeof cellVal === "number") return cellVal.toString();
        if (typeof cellVal === "string") {
            const trimmed = cellVal.trim();
            if (trimmed.includes("GMT") || trimmed.includes("Arabian Standard Time") || /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)) {
                const d = new Date(trimmed);
                if (!isNaN(d.getTime())) {
                    const pad = (n) => n.toString().padStart(2, "0");
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                }
            }
            return trimmed;
        }
        if (typeof cellVal === "object") {
            if ("result" in cellVal && cellVal.result !== null && cellVal.result !== undefined) {
                return formatCellVal(cellVal.result);
            }
            if ("text" in cellVal && cellVal.text) {
                return formatCellVal(cellVal.text);
            }
        }
        return cellVal.toString().trim();
    };

    const formatDateNoShift = (val, fallback) => {
        if (!val) return fallback;
        if (val instanceof Date) {
            if (isNaN(val.getTime())) return fallback;
            const pad = (n) => n.toString().padStart(2, "0");
            return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}T00:00:00`;
        }
        if (typeof val === "string") {
            const trimmed = val.trim();
            if (trimmed.includes("GMT") || trimmed.includes("Arabian Standard Time") || /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(trimmed)) {
                const d = new Date(trimmed);
                if (!isNaN(d.getTime())) {
                    const pad = (n) => n.toString().padStart(2, "0");
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
                }
            }
            if (trimmed.includes("T")) return trimmed.split(".")[0];
            if (trimmed.length >= 10) return `${trimmed.substring(0, 10)}T00:00:00`;
            return fallback;
        }
        return fallback;
    };

    const parsedInstCode = formatCellVal(worksheet.getCell("C8").value) || formatCellVal(worksheet.getCell("B8").value) || instCode || "0000001";
    const finYearStr = formatCellVal(worksheet.getCell("C9").value);
    const sDateRaw = worksheet.getCell("C10").value;
    const eDateRaw = worksheet.getCell("C11").value;

    const formattedStartDate = formatDateNoShift(startDate || sDateRaw, "2026-07-01T00:00:00");
    const formattedEndDate = formatDateNoShift(endDate || eDateRaw, "2026-07-31T00:00:00");
    const finYear = finYearStr ? parseInt(finYearStr, 10) : 2026;

    const itemValuesMap = {};
    let itemIndex = 0;

    for (let r = 17; r <= 50; r++) {
        const row = worksheet.getRow(r);
        for (let c = 3; c <= 11; c++) {
            if (itemIndex < LC001_ITEM_DEFINITIONS.length - 1) {
                const code = LC001_ITEM_DEFINITIONS[itemIndex].code;
                itemValuesMap[code] = formatCellVal(row.getCell(c).value);
                itemIndex++;
            }
        }
    }

    const summaryCellVal = formatCellVal(worksheet.getCell("J51").value) ||
                           formatCellVal(worksheet.getCell("I51").value);

    itemValuesMap["122_00307"] = summaryCellVal;

    const returnItemsList = LC001_ITEM_DEFINITIONS.map((def) => ({
        Code: def.code,
        Value: itemValuesMap[def.code] !== undefined ? itemValuesMap[def.code] : "",
        _description: def.description,
        _dataType: def.dataType,
        _required: def.required
    }));

    return {
        ReturnKey: "M_LCPLC001",
        InstCode: parsedInstCode,
        FinYear: finYear,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
}

export async function jsonToExcelLC001(jsonPayload) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Loan Class & Prov");

    // Title Banner Merged A4:K7
    sheet.mergeCells("A4:K7");
    const titleCell = sheet.getCell("A4");
    titleCell.value = "Loan Classification and Provisioning";
    titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFF0000" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2DCDB" } };

    const cleanDate = (isoStr) => isoStr ? isoStr.split("T")[0] : "";

    sheet.getCell("A8").value = "Instituion Code";
    sheet.getCell("C8").value = jsonPayload.InstCode || "0000001";

    sheet.getCell("A9").value = "Financial Year";
    sheet.getCell("C9").value = jsonPayload.FinYear || 2026;

    sheet.getCell("A10").value = "Start Date";
    sheet.getCell("C10").value = cleanDate(jsonPayload.StartDate) || "2026-07-01";

    sheet.getCell("A11").value = "End Date";
    sheet.getCell("C11").value = cleanDate(jsonPayload.EndDate) || "2026-07-31";

    // Table Header Banner Row 13
    sheet.mergeCells("A13:K13");
    const banner13 = sheet.getCell("A13");
    banner13.value = "Amount in Millions of Birr";
    banner13.alignment = { horizontal: "right" };
    banner13.font = { bold: true };
    banner13.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF00" } };

    // Headers Row 14, 15, 16
    sheet.getCell("A14").value = "Code";
    sheet.getCell("B14").value = "Loan classification";
    sheet.getCell("C14").value = "Amount";
    sheet.mergeCells("D14:G14");
    sheet.getCell("D14").value = "Deductible collateral";
    sheet.getCell("H14").value = "Provisioning rate";
    sheet.getCell("I14").value = "Required provision";
    sheet.getCell("J14").value = "Accumulated provision held";
    sheet.getCell("K14").value = "Excess/shortfall in provisions";

    sheet.getCell("D15").value = "Cash/cash substitute";
    sheet.getCell("E15").value = "Net recoverable value";
    sheet.getCell("F15").value = "Total";
    sheet.getCell("G15").value = "Net loans and advances";

    sheet.getRow(14).font = { bold: true };
    sheet.getRow(15).font = { bold: true };

    const itemsMap = {};
    if (jsonPayload.ReturnItemsList && Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach(item => {
            itemsMap[item.Code] = item.Value !== undefined ? item.Value : "";
        });
    }

    let itemIndex = 0;
    for (let r = 17; r <= 50; r++) {
        const row = sheet.getRow(r);
        for (let c = 3; c <= 11; c++) {
            if (itemIndex < LC001_ITEM_DEFINITIONS.length - 1) {
                const code = LC001_ITEM_DEFINITIONS[itemIndex].code;
                const rawVal = itemsMap[code];
                const numVal = (rawVal !== "" && rawVal !== undefined && !isNaN(parseFloat(rawVal))) ? parseFloat(rawVal) : (rawVal || "");
                row.getCell(c).value = numVal;
                itemIndex++;
            }
        }
    }

    const summaryVal = itemsMap["122_00307"];
    sheet.getCell("B51").value = "Total_Accumulated provision held in the previous period";
    sheet.getCell("J51").value = (summaryVal !== "" && summaryVal !== undefined && !isNaN(parseFloat(summaryVal))) ? parseFloat(summaryVal) : (summaryVal || "");
    sheet.getCell("J51").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF00" } };

    return workbook;
}




function sanitizeJsonPayload(payload: any): any {
    if (!payload) return payload;
    if (Array.isArray(payload.ReturnItemsList)) {
        payload.ReturnItemsList = payload.ReturnItemsList.map((item: any) => {
            if (!item) return item;
            const val = item.Value;
            const isZero = val === null || val === undefined || String(val).trim() === "";
            return {
                ...item,
                Value: isZero ? "0" : String(val).trim()
            };
        });
    }
    if (Array.isArray(payload.DynamicItemsList)) {
        payload.DynamicItemsList = payload.DynamicItemsList.map((entry: any) => {
            if (!entry) return entry;
            if (Array.isArray(entry.DynamicItems)) {
                entry.DynamicItems = entry.DynamicItems.map((subItem: any) => {
                    if (!subItem) return subItem;
                    const isNumeric = subItem._dataType === "NUMERIC" ||
                        (subItem.Code && !["1.1", "1.2", "1.4", "1.6"].includes(subItem.Code) && !subItem.Code.endsWith(".name"));
                    const val = subItem.Value;
                    const isZero = val === null || val === undefined || String(val).trim() === "";
                    return {
                        ...subItem,
                        Value: (isNumeric && isZero) ? "0" : (val === null || val === undefined ? "" : String(val).trim())
                    };
                });
            } else if (typeof entry === "object") {
                Object.keys(entry).forEach((k) => {
                    if (k.startsWith("_")) return;
                    const val = entry[k];
                    if (val === null || val === undefined || String(val).trim() === "") {
                        entry[k] = "0";
                    } else {
                        entry[k] = String(val).trim();
                    }
                });
            }
            return entry;
        });
    }
    return payload;
}



export async function processLC001Report(
    instCode: string = "0000001",
    inputFilePath: string,
    startDateStr: string,
    endDateStr: string,
    outputExcelPath: string,
    outputPathJson: string
): Promise<{ success: boolean; error?: string; jsonPath?: string; excelPath?: string }> {
    try {
        if (!inputFilePath || !fs.existsSync(inputFilePath)) {
            return {
                success: false,
                error: "Input file '${inputFilePath}' not found."
            };
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return {
                success: false,
                error: "Worksheet not found in uploaded Excel file."
            };
        }

        const rawJson = processLC001(worksheet, instCode, startDateStr, endDateStr);
        const jsonPayload = sanitizeJsonPayload(rawJson);

        const jsonDir = path.dirname(outputPathJson);
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }
        fs.writeFileSync(outputPathJson, JSON.stringify(jsonPayload, null, 4), "utf8");

        if (outputExcelPath) {
            const excelDir = path.dirname(outputExcelPath);
            if (!fs.existsSync(excelDir)) {
                fs.mkdirSync(excelDir, { recursive: true });
            }
            const outWorkbook = await jsonToExcelLC001(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing LC001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process LC001 report."
        };
    }
}


