export const formatFullDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true,
        month: 'short', day: 'numeric', year: 'numeric',
    });
};

export const formatRelative = (dateStr: string) => {
    if (!dateStr) return '';
    const now = new Date();
    const past = new Date(dateStr);
    const diffInMs = now.getTime() - past.getTime();
    const mins = Math.floor(diffInMs / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
};
