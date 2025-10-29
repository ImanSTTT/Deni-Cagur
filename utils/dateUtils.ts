
export const calculateDaysRemaining = (dueDate: string, warningDays: number = 7) => {
    const due = new Date(dueDate);
    const today = new Date();
    // Reset time to 00:00:00 to compare dates only
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { days: Math.abs(diffDays), label: `Terlambat ${Math.abs(diffDays)} hari`, status: 'overdue' };
    }
    if (diffDays === 0) {
        return { days: diffDays, label: 'Hari ini', status: 'deadline' };
    }
    if (diffDays <= warningDays) {
        return { days: diffDays, label: `${diffDays} hari lagi`, status: 'warning' };
    }
    return { days: diffDays, label: `${diffDays} hari lagi`, status: 'safe' };
};
