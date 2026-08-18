interface DateCheckResult {
    isFirstDayOfWeek: boolean;
    isFirstDayOfMonth: boolean;
    isFirstDayOfQuarter: boolean;
    isFirstDayOfYear: boolean;
}

export const checkFirstDays = (
    date: Date,
    weekStartsOn: 0 | 1 = 1
): DateCheckResult => {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const month = date.getMonth();

    const isFirstDayOfWeek = dayOfWeek === weekStartsOn;
    const isFirstDayOfMonth = dayOfMonth === 1;
    const isFirstDayOfQuarter = isFirstDayOfMonth && month % 3 === 0;
    const isFirstDayOfYear = isFirstDayOfMonth && month === 0;

    return {
        isFirstDayOfWeek,
        isFirstDayOfMonth,
        isFirstDayOfQuarter,
        isFirstDayOfYear
    };
};
