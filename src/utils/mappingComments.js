import { checkOwnerReply } from "./checkOwner";

export const mapApiData = (apiData) => {
    return (apiData || []).map((apiComment) => {
        const replies = apiComment.replies || [];
        const hasOwnerReplied = checkOwnerReply(replies);
        return {
            id: apiComment.id,
            user: {
                name: apiComment.author,
                avatar: apiComment.authorImage,
                source: "YouTube",
            },
            time: new Date(apiComment.publishedAt).toLocaleDateString(),
            publishedAt: apiComment.publishedAt,
            comment: apiComment.text,
            replies: replies,
            reply: null,
            status: hasOwnerReplied ? "Replied" : "Pending",
            videoLink: apiComment.videoLink,
        };
    });
};