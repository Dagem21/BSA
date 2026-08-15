var fs = require("fs");

export const writeToLog = async (error: string, functionName: string) => {
    try {
        const currentDate = new Date();
        const date =
            currentDate.getDate() +
            "-" +
            (currentDate.getMonth() + 1) +
            "-" +
            currentDate.getFullYear();

        fs.appendFile(
            "./logs/" + date + ".txt",
            currentDate + " : " + functionName + ":" + error + "\n",
            "utf8",
            function (err: string) {
                if (err) {
                    console.log(err);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};
