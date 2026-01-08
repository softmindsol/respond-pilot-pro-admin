import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
    setComments,
    setLoading,
    generateAiReply,
    postReplyToYoutube,
    setLoadingMore,
    appendComments,
} from "../store/features/youtube/youtubeSlice";
import toast from "react-hot-toast";
import { fetchUserProfile } from "../store/features/auth/authActions";
import { mapApiData } from "../utils/mappingComments";

export const useLatestComments = ({ videoId, isConnected }) => {
    const [activeTab, setActiveTab] = useState("All");
    const [isBulkPosting, setIsBulkPosting] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkReplyText, setBulkReplyText] = useState("");

    const dispatch = useDispatch();

    const {
        comments = [],
        loading,
        loadingMore,
        nextPageToken,
    } = useSelector((state) => state?.youtube);

    const { token, user } = useSelector((state) => state?.auth);

    // 1. Fetch Comments Effect
    useEffect(() => {
        const fetchComments = async () => {
            if (!isConnected || !videoId || !token) return;

            dispatch(setLoading(true));
            try {
                const API_BASE =
                    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
                const response = await axios.get(`${API_BASE}/youtube/comments`, {
                    params: { videoId },
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                if (response.status === 200) {
                    const mappedComments = mapApiData(data.comments);
                    dispatch(
                        setComments({
                            comments: mappedComments,
                            nextPageToken: data?.nextPageToken,
                            pageInfo: data?.pageInfo,
                        })
                    );


                } else {
                    console.error("Comments fetch failed", data);
                    dispatch(setComments({ comments: [] }));
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
                dispatch(setComments({ comments: [] }));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchComments();
    }, [videoId, isConnected, token, dispatch]);

    // 2. Filter Comments
    const filteredComments = comments?.filter((item) => {
        if (activeTab === "All") return true;
        if (activeTab === "Flagged") return item.isFlagged;
        return item?.status === activeTab;
    });

    // 3. Handlers
    const handleReplyAll = async () => {
        const safeDrafts = comments.filter(
            (c) =>
                c.status === "Pending" && c.draft && !c.isFlagged && !c.isGenerating
        );

        if (safeDrafts.length === 0) {
            toast("No safe drafts ready to approve.", { icon: "ℹ️" });
            return;
        }

        setIsBulkPosting(true);
        const toastId = toast.loading(`Approving ${safeDrafts.length} replies...`);

        const results = await Promise.allSettled(
            safeDrafts.map((comment) =>
                dispatch(
                    postReplyToYoutube({
                        commentId: comment.id,
                        replyText: comment.draft,
                    })
                ).unwrap()
            )
        );

        const successCount = results.filter((r) => r.status === "fulfilled").length;
        const failCount = results.filter((r) => r.status === "rejected").length;

        if (failCount > 0) {
            toast.error(`${successCount} posted, ${failCount} failed.`, {
                id: toastId,
            });
        } else {
            toast.success(`All ${successCount} replies posted!`, { id: toastId });
        }
        dispatch(fetchUserProfile());

        setIsBulkPosting(false);
    };

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) return;
        if (!bulkReplyText.trim()) {
            toast.error("Please enter a reply for bulk action.");
            return;
        }

        setIsBulkPosting(true);
        const toastId = toast.loading(
            `Approving ${selectedIds.length} comments...`
        );

        const results = await Promise.allSettled(
            selectedIds.map((id) =>
                dispatch(
                    postReplyToYoutube({
                        commentId: id,
                        replyText: bulkReplyText,
                    })
                ).unwrap()
            )
        );

        const successCount = results.filter((r) => r.status === "fulfilled").length;
        const failCount = results.filter((r) => r.status === "rejected").length;

        if (failCount > 0) {
            toast.error(`${successCount} posted, ${failCount} failed.`, {
                id: toastId,
            });
        } else {
            toast.success(`All ${successCount} replies posted!`, { id: toastId });
        }
        dispatch(fetchUserProfile());

        setSelectedIds([]);
        setBulkReplyText("");
        setIsBulkPosting(false);
    };

    const handleGenerateReply = async (commentDetail) => {
        if (user?.repliesUsed >= user?.repliesLimit) {
            toast.error("You have reached your reply limit.");
            return "";
        }
        try {
            const result = await dispatch(
                generateAiReply({
                    commentId: commentDetail.commentId,
                    commentText: commentDetail.commentText,
                    tone: user?.tone || "friendly",
                    authorName: commentDetail.authorName,
                })
            ).unwrap();
            return result.reply;
        } catch (error) {
            console.log("error:", error?.message)
            toast.error(error?.message || "Failed to generate AI reply");
            return "";
        }
    };

    const handleApproveReply = async (replyText, commentId) => {
        if (user?.repliesUsed >= user?.repliesLimit) {
            toast.error("You have reached your reply limit.");
            return;
        }
        if (!replyText || !commentId) return;
        try {
            await dispatch(postReplyToYoutube({ commentId, replyText })).unwrap();
            toast.success("Reply posted successfully!");
            dispatch(fetchUserProfile());
        } catch (error) {
            toast.error("Failed to post reply.");
            console.error(error);
        }
    };

    const handleLoadMore = async () => {
        if (!nextPageToken) return;

        dispatch(setLoadingMore(true));
        try {
            const API_BASE =
                import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const response = await axios.get(`${API_BASE}/youtube/comments`, {
                params: {
                    videoId,
                    pageToken: nextPageToken,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                const mappedNewComments = mapApiData(response.data.comments);
                dispatch(
                    appendComments({
                        mappedComments: mappedNewComments,
                        nextPageToken: response.data.nextPageToken,
                    })
                );


            }
        } catch (error) {
            console.log("error:", error);
            toast.error("Failed to load more comments");
        } finally {
            dispatch(setLoadingMore(false));
        }
    };

    return {
        activeTab,
        setActiveTab,
        isBulkPosting,
        selectedIds,
        setSelectedIds,
        bulkReplyText,
        setBulkReplyText,
        loading,
        loadingMore,
        nextPageToken,
        filteredComments,
        handleReplyAll,
        handleBulkApprove,
        handleGenerateReply,
        handleApproveReply,
        handleLoadMore,
    };
};
