const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/utils/services/BP001/jsonFormat.ts');
let code = fs.readFileSync(filePath, 'utf-8');

// Update fmt function to return "0" for empty/invalid values and clean commas
code = code.replace(
    /const fmt = \([^)]*\) => \{[\s\S]*?\};/,
    `const fmt = (val: number | string | undefined | null) => {
        if (val === undefined || val === null) return "0";
        const str = val.toString().trim().replace(/,/g, "");
        if (
            str === "" ||
            str === "-" ||
            str === "—" ||
            str === "–" ||
            str === "--" ||
            str.toLowerCase() === "n/a" ||
            str.toLowerCase() === "nil" ||
            isNaN(Number(str))
        ) {
            return "0";
        }
        return str;
    };`
);

// Remove _required: false
code = code.replace(/, _required: false/g, '');

fs.writeFileSync(filePath, code, 'utf-8');
console.log('Successfully updated jsonFormat.ts for BP001');
