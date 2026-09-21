const { validateTemplate } = require("../src/utils/fileValidation");
const yup = require("yup");
const fs = require("fs");
const path = require("path");

const reportTypesList = [
    { _id: "65f1234567890abcdef12345", reportId: "CAP_ADQ_CAP_QC001", description: "QC001 Capital Components" },
    { _id: "65f1234567890abcdef12346", reportId: "CAP_ADQ_OFB_QO001", description: "QO001 Off Balance Sheet" },
    { _id: "65f1234567890abcdef12347", reportId: "CAP_ADQ_ITEM_QI001", description: "QI001 On Balance Sheet" }
];

async function runTest() {
    const reportSchema = yup.object().shape({
        reportType: yup.string().required(),
        file: yup.mixed().test("fileFormat", "Invalid template", async (value, context) => {
            const reportIdRaw = context.parent.reportType || "";
            const reportTypes = context.options?.context?.reportTypes;
            const matchedType = reportTypes?.find((t) => String(t._id) === String(reportIdRaw));
            const reportIdStr = matchedType?.reportId || matchedType?.description || reportIdRaw;

            const res = await validateTemplate(value, reportIdStr);
            if (!res.isValid) {
                return context.createError({ message: res.errorMessage });
            }
            return true;
        })
    });

    const qc001Path = path.join(process.cwd(), "templates", "QC001.xlsx");
    const qo001Path = path.join(process.cwd(), "templates", "QO001.xlsx");
    const qi001Path = path.join(process.cwd(), "templates", "QI001.xlsx");

    const qc001Buffer = fs.readFileSync(qc001Path);
    const qo001Buffer = fs.readFileSync(qo001Path);
    const qi001Buffer = fs.readFileSync(qi001Path);

    console.log("--- Yup Context Test 1: Selecting QC001 ID with QC001 template file ---");
    try {
        await reportSchema.validate({
            reportType: "65f1234567890abcdef12345",
            file: qc001Buffer
        }, { context: { reportTypes: reportTypesList } });
        console.log("Passed: QC001 file accepted when QC001 selected.");
    } catch (e) {
        console.log("Error:", e.message);
    }

    console.log("\n--- Yup Context Test 2: Selecting QC001 ID with QO001 template file ---");
    try {
        await reportSchema.validate({
            reportType: "65f1234567890abcdef12345",
            file: qo001Buffer
        }, { context: { reportTypes: reportTypesList } });
        console.log("Unexpected Pass!");
    } catch (e) {
        console.log("Correctly Blocked:", e.message);
    }

    console.log("\n--- Yup Context Test 3: Selecting QO001 ID with QI001 template file ---");
    try {
        await reportSchema.validate({
            reportType: "65f1234567890abcdef12346",
            file: qi001Buffer
        }, { context: { reportTypes: reportTypesList } });
        console.log("Unexpected Pass!");
    } catch (e) {
        console.log("Correctly Blocked:", e.message);
    }
}

runTest();
