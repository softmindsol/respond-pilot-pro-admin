export const checkOwnerReply = (replies) => {
    if (!replies || replies.length === 0) return false;
    // Check agar koi bhi reply 'isOwner: true' rakhta hai
    return replies.some((r) => r.isOwner === true);
};