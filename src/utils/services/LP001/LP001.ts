// @ts-nocheck
import ExcelJS from "exceljs";
import * as path from "path";
import * as fs from "fs";

const LP001_ITEM_DEFINITIONS = [
    { code: "21_00001", description: "Pass (Sum 1.1-1.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00002", description: "Pass (Sum 1.1-1.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00003", description: "Pass (Sum 1.1-1.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00004", description: "Pass (Sum 1.1-1.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00005", description: "Pass (Sum 1.1-1.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00006", description: "Pass (Sum 1.1-1.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00007", description: "Pass (Sum 1.1-1.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00008", description: "Pass (Sum 1.1-1.4)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00009", description: "Pass (Sum 1.1-1.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00010", description: "1.1 Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00011", description: "1.1 Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00012", description: "1.1 Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00013", description: "1.1 Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00014", description: "1.1 Term loan_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00015", description: "1.1 Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00016", description: "1.1 Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00017", description: "1.1 Term loan_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00018", description: "1.1 Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00019", description: "1.2 Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00020", description: "1.2 Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00021", description: "1.2 Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00022", description: "1.2 Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00023", description: "1.2 Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00024", description: "1.2 Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00025", description: "1.2 Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00026", description: "1.2 Overdraft_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00027", description: "1.2 Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00028", description: "1.3 Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00029", description: "1.3 Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00030", description: "1.3 Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00031", description: "1.3 Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00032", description: "1.3 Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00033", description: "1.3 Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00034", description: "1.3 Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00035", description: "1.3 Merchandize_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00036", description: "1.3 Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00037", description: "1.4 others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00038", description: "1.4 others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00039", description: "1.4 others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00040", description: "1.4 others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00041", description: "1.4 others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00042", description: "1.4 others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00043", description: "1.4 others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00044", description: "1.4 others_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00045", description: "1.4 others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00046", description: "Special mention (Sum 2.1-2.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00047", description: "Special mention (Sum 2.1-2.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00048", description: "Special mention (Sum 2.1-2.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00049", description: "Special mention (Sum 2.1-2.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00050", description: "Special mention (Sum 2.1-2.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00051", description: "Special mention (Sum 2.1-2.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00052", description: "Special mention (Sum 2.1-2.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00053", description: "Special mention (Sum 2.1-2.4)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00054", description: "Special mention (Sum 2.1-2.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00055", description: "Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00056", description: "Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00057", description: "Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00058", description: "Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00059", description: "Term loan_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00060", description: "Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00061", description: "Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00062", description: "Term loan_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00063", description: "Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00064", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00065", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00066", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00067", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00068", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00069", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00070", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00071", description: "Overdraft_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00072", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00073", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00074", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00075", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00076", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00077", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00078", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00079", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00080", description: "Merchandize_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00081", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00082", description: "others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00083", description: "others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00084", description: "others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00085", description: "others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00086", description: "others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00087", description: "others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00088", description: "others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00089", description: "others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00090", description: "others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00091", description: "Substandard (3.1+3.2)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00092", description: "Substandard (3.1+3.2)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00093", description: "Substandard (3.1+3.2)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00094", description: "Substandard (3.1+3.2)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00095", description: "Substandard (3.1+3.2)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00096", description: "Substandard (3.1+3.2)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00097", description: "Substandard (3.1+3.2)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00098", description: "Substandard (3.1+3.2)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00099", description: "Substandard (3.1+3.2)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00100", description: "Renegotiated (Sum 3.1.1-3.1.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00101", description: "Renegotiated (Sum 3.1.1-3.1.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00102", description: "Renegotiated (Sum 3.1.1-3.1.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00103", description: "Renegotiated (Sum 3.1.1-3.1.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00104", description: "Renegotiated (Sum 3.1.1-3.1.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00105", description: "Renegotiated (Sum 3.1.1-3.1.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00106", description: "Renegotiated (Sum 3.1.1-3.1.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00107", description: "Renegotiated (Sum 3.1.1-3.1.4)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00108", description: "Renegotiated (Sum 3.1.1-3.1.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00109", description: "Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00110", description: "Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00111", description: "Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00112", description: "Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00113", description: "Term loan_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00114", description: "Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00115", description: "Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00116", description: "Term loan_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00117", description: "Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00118", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00119", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00120", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00121", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00122", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00123", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00124", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00125", description: "Overdraft_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00126", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00127", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00128", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00129", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00130", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00131", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00132", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00133", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00134", description: "Merchandize_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00135", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00136", description: "Others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00137", description: "Others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00138", description: "Others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00139", description: "Others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00140", description: "Others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00141", description: "Others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00142", description: "Others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00143", description: "Others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00144", description: "Others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00145", description: "Non-Renegotiated_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00146", description: "Non-Renegotiated_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00147", description: "Non-Renegotiated_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00148", description: "Non-Renegotiated_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00149", description: "Non-Renegotiated_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00150", description: "Non-Renegotiated_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00151", description: "Non-Renegotiated_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00152", description: "Non-Renegotiated_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00153", description: "Non-Renegotiated_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00154", description: "Term loan (Sum 3.2.1-3.2.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00155", description: "Term loan (Sum 3.2.1-3.2.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00156", description: "Term loan (Sum 3.2.1-3.2.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00157", description: "Term loan (Sum 3.2.1-3.2.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00158", description: "Term loan (Sum 3.2.1-3.2.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00159", description: "Term loan (Sum 3.2.1-3.2.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00160", description: "Term loan (Sum 3.2.1-3.2.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00161", description: "Term loan (Sum 3.2.1-3.2.4)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00162", description: "Term loan (Sum 3.2.1-3.2.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00163", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00164", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00165", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00166", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00167", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00168", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00169", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00170", description: "Overdraft_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00171", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00172", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00173", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00174", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00175", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00176", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00177", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00178", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00179", description: "Merchandize_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00180", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00181", description: "Others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00182", description: "Others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00183", description: "Others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00184", description: "Others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00185", description: "Others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00186", description: "Others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00187", description: "Others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00188", description: "Others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00189", description: "Others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00190", description: "Doubtful (Sum 4.1-4.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00191", description: "Doubtful (Sum 4.1-4.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00192", description: "Doubtful (Sum 4.1-4.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00193", description: "Doubtful (Sum 4.1-4.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00194", description: "Doubtful (Sum 4.1-4.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00195", description: "Doubtful (Sum 4.1-4.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00196", description: "Doubtful (Sum 4.1-4.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00197", description: "Doubtful (Sum 4.1-4.4)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00198", description: "Doubtful (Sum 4.1-4.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00199", description: "Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00200", description: "Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00201", description: "Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00202", description: "Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00203", description: "Term loan_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00204", description: "Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00205", description: "Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00206", description: "Term loan_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00207", description: "Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00208", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00209", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00210", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00211", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00212", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00213", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00214", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00215", description: "Overdraft_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00216", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00217", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00218", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00219", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00220", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00221", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00222", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00223", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00224", description: "Merchandize_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00225", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00226", description: "Others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00227", description: "Others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00228", description: "Others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00229", description: "Others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00230", description: "Others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00231", description: "Others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00232", description: "Others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00233", description: "Others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00234", description: "Others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00235", description: "Loss loans (Sum 5.1-5.4)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00236", description: "Loss loans (Sum 5.1-5.4)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00237", description: "Loss loans (Sum 5.1-5.4)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00238", description: "Loss loans (Sum 5.1-5.4)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00239", description: "Loss loans (Sum 5.1-5.4)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00240", description: "Loss loans (Sum 5.1-5.4)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00241", description: "Loss loans (Sum 5.1-5.4)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00242", description: "Loss loans (Sum 5.1-5.4)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00243", description: "Loss loans (Sum 5.1-5.4)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00244", description: "Term loan_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00245", description: "Term loan_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00246", description: "Term loan_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00247", description: "Term loan_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00248", description: "Term loan_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00249", description: "Term loan_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00250", description: "Term loan_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00251", description: "Term loan_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00252", description: "Term loan_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00253", description: "Overdraft_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00254", description: "Overdraft_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00255", description: "Overdraft_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00256", description: "Overdraft_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00257", description: "Overdraft_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00258", description: "Overdraft_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00259", description: "Overdraft_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00260", description: "Overdraft_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00261", description: "Overdraft_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00262", description: "Merchandize_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00263", description: "Merchandize_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00264", description: "Merchandize_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00265", description: "Merchandize_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00266", description: "Merchandize_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00267", description: "Merchandize_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00268", description: "Merchandize_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00269", description: "Merchandize_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00270", description: "Merchandize_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00271", description: "others_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00272", description: "others_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00273", description: "others_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00274", description: "others_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00275", description: "others_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00276", description: "others_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00277", description: "others_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00278", description: "others_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00279", description: "others_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00280", description: "Total (Sum 1-5)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00281", description: "Total (Sum 1-5)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00282", description: "Total (Sum 1-5)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00283", description: "Total (Sum 1-5)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00284", description: "Total (Sum 1-5)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00285", description: "Total (Sum 1-5)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00286", description: "Total (Sum 1-5)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00287", description: "Total (Sum 1-5)_Accumulated provision held in the previous period_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00288", description: "Total (Sum 1-5)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00289", description: "Total Non Performing (Sum 3-5)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00290", description: "Total Non Performing (Sum 3-5)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00291", description: "Total Non Performing (Sum 3-5)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00292", description: "Total Non Performing (Sum 3-5)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00293", description: "Total Non Performing (Sum 3-5)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00294", description: "Total Non Performing (Sum 3-5)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00295", description: "Total Non Performing (Sum 3-5)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00296", description: "Total Non Performing (Sum 3-5)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00297", description: "Total Non Performing (Sum 3-5)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00298", description: "NPLs to Total Loans Ratio(7/6)_Amount (A)", dataType: "NUMERIC", required: false },
    { code: "21_00299", description: "NPLs to Total Loans Ratio(7/6)_Deductible collateral_Cash/cash substitute_(B)", dataType: "NUMERIC", required: false },
    { code: "21_00300", description: "NPLs to Total Loans Ratio(7/6)_Deductible collateral_Net recoverable value_(C)", dataType: "NUMERIC", required: false },
    { code: "21_00301", description: "NPLs to Total Loans Ratio(7/6)_Deductible collateral_Total _(D=B+C)", dataType: "NUMERIC", required: false },
    { code: "21_00302", description: "NPLs to Total Loans Ratio(7/6)_Deductible collateral_Net loans and advances_(E=A-D)", dataType: "NUMERIC", required: false },
    { code: "21_00303", description: "NPLs to Total Loans Ratio(7/6)_Provisioning rate_(F)", dataType: "NUMERIC", required: false },
    { code: "21_00304", description: "NPLs to Total Loans Ratio(7/6)_Required provision_(G=ExF)", dataType: "NUMERIC", required: false },
    { code: "21_00305", description: "NPLs to Total Loans Ratio(7/6)_Accumulated provision held_(H)", dataType: "NUMERIC", required: false },
    { code: "21_00306", description: "NPLs to Total Loans Ratio(7/6)_Excess/shortfall in provisions_(I=H-G)", dataType: "NUMERIC", required: false },
    { code: "21_00307", description: "Total_Accumulated provision held ", dataType: "NUMERIC", required: false }
];

export function processLP001(worksheet, instCode, startDate, endDate) {
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

    const parsedInstCode = formatCellVal(worksheet.getCell("C4").value) || formatCellVal(worksheet.getCell("B4").value) || instCode || "0000001";
    const finYearStr = formatCellVal(worksheet.getCell("C5").value);
    const sDateRaw = worksheet.getCell("C6").value;
    const eDateRaw = worksheet.getCell("C7").value;

    const formattedStartDate = formatDateNoShift(startDate || sDateRaw, "2026-04-01T00:00:00");
    const formattedEndDate = formatDateNoShift(endDate || eDateRaw, "2026-06-30T00:00:00");
    const finYear = finYearStr ? parseInt(finYearStr, 10) : 2026;

    const itemValuesMap = {};
    let itemIndex = 0;

    for (let r = 16; r <= 49; r++) {
        const row = worksheet.getRow(r);
        for (let c = 3; c <= 11; c++) {
            if (itemIndex < LP001_ITEM_DEFINITIONS.length - 1) {
                const code = LP001_ITEM_DEFINITIONS[itemIndex].code;
                itemValuesMap[code] = formatCellVal(row.getCell(c).value);
                itemIndex++;
            }
        }
    }

    const summaryCellVal = formatCellVal(worksheet.getCell("J50").value) ||
                           formatCellVal(worksheet.getCell("I50").value) ||
                           formatCellVal(worksheet.getCell("H50").value);

    itemValuesMap["21_00307"] = summaryCellVal;

    const returnItemsList = LP001_ITEM_DEFINITIONS.map((def) => ({
        Code: def.code,
        Value: itemValuesMap[def.code] !== undefined ? itemValuesMap[def.code] : "",
        _description: def.description,
        _dataType: def.dataType,
        _required: def.required
    }));

    return {
        ReturnKey: "LOAN_CLA&PROV_LP001",
        InstCode: parsedInstCode,
        FinYear: finYear,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        ReturnItemsList: returnItemsList,
        DynamicItemsList: []
    };
}

export async function jsonToExcelLP001(jsonPayload) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Loan Class & Prov");

    // Header metadata
    sheet.getCell("A4").value = "Instituion code";
    sheet.getCell("C4").value = jsonPayload.InstCode || "0000001";

    sheet.getCell("A5").value = "Financial Year";
    sheet.getCell("C5").value = jsonPayload.FinYear || 2026;

    sheet.getCell("A6").value = "Start Date";
    sheet.getCell("C6").value = jsonPayload.StartDate || "2026-04-01T00:00:00";

    sheet.getCell("A7").value = "End Date";
    sheet.getCell("C7").value = jsonPayload.EndDate || "2026-06-30T00:00:00";

    // Map ReturnItemsList by Code
    const itemsMap = {};
    if (jsonPayload.ReturnItemsList && Array.isArray(jsonPayload.ReturnItemsList)) {
        jsonPayload.ReturnItemsList.forEach(item => {
            itemsMap[item.Code] = item.Value !== undefined ? item.Value : "";
        });
    }

    // Populate Data Grid (Rows 16 to 49, Columns C=3 to K=11)
    let itemIndex = 0;
    for (let r = 16; r <= 49; r++) {
        const row = sheet.getRow(r);
        for (let c = 3; c <= 11; c++) {
            if (itemIndex < LP001_ITEM_DEFINITIONS.length - 1) {
                const code = LP001_ITEM_DEFINITIONS[itemIndex].code;
                const rawVal = itemsMap[code];
                const numVal = (rawVal !== "" && rawVal !== undefined && !isNaN(parseFloat(rawVal))) ? parseFloat(rawVal) : (rawVal || "");
                row.getCell(c).value = numVal;
                itemIndex++;
            }
        }
    }

    // Summary item 21_00307 in J50
    const summaryVal = itemsMap["21_00307"];
    sheet.getCell("J50").value = (summaryVal !== "" && summaryVal !== undefined && !isNaN(parseFloat(summaryVal))) ? parseFloat(summaryVal) : (summaryVal || "");

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



export async function processLP001Report(
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

        const rawJson = processLP001(worksheet, instCode, startDateStr, endDateStr);
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
            const outWorkbook = await jsonToExcelLP001(jsonPayload);
            await outWorkbook.xlsx.writeFile(outputExcelPath);
        }

        return {
            success: true,
            jsonPath: outputPathJson,
            excelPath: outputExcelPath
        };
    } catch (err: any) {
        console.error("Error processing LP001 report:", err);
        return {
            success: false,
            error: err.message || "Failed to process LP001 report."
        };
    }
}


