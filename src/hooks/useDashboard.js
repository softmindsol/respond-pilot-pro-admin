import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchUserProfile } from "../store/features/auth/authActions";
import {
    generateAiReply,
    postReplyToYoutube,
} from "../store/features/youtube/youtubeSlice";

export const useDashboard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [videos, setVideos] = useState([]);
    const [selectedVideoId, setSelectedVideoId] = useState("");
    const [isLoadingVideos, setIsLoadingVideos] = useState(false);
    const [timeFilter, setTimeFilter] = useState("All");

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, token } = useSelector((state) => state?.auth);
    const {
        comments = [],
        loading,
    } = useSelector((state) => state?.youtube);

    // 1. OAuth Success Logic
    useEffect(() => {
        const success = searchParams.get("success");
        if (success === "channel_connected") {
            toast.success("Channel Connected!");
            dispatch(fetchUserProfile());
            navigate("/dashboard", { replace: true });
        }
    }, [searchParams, navigate, dispatch]);



    const fetchChannelVideos = async (isRefresh = false) => {
        if (!token || !user?.isConnectedToYoutube) return;

        setIsLoadingVideos(true);
        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

            // 🔥 Update: limit=50 pass karein
            const response = await fetch(`${API_BASE}/youtube/videos?refresh=${isRefresh}&limit=50`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (response.ok && data.videos) {
                setVideos(data.videos);
                // Auto-select first (Latest) video
                if (!selectedVideoId && data.videos.length > 0) {
                    setSelectedVideoId(data.videos[0].videoId);
                }
                if (isRefresh) toast.success("Videos synced!");
            }
        } catch (error) {
            toast.error("Failed to fetch videos");
        } finally {
            setIsLoadingVideos(false);
        }
    };

    useEffect(() => {
        fetchChannelVideos(false);
    }, [token, user?.isConnectedToYoutube]);


    // 3. Search Filter Logic
    const filteredVideos = videos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 4. Activity Comments Filter Logic
    const activityComments = (comments || []).filter((comment) => {
        // Status Filter (Only Pending/Flagged)
        if (comment.status !== "Pending" && comment.status !== "Flagged") {
            return false;
        }

        // Time Filter
        if (timeFilter === "All") return true;
        if (!comment.publishedAt) return true;

        const commentDate = new Date(comment.publishedAt);
        const now = new Date();
        const diffTime = Math.abs(now - commentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeFilter === "1week") return diffDays <= 7;
        if (timeFilter === "2weeks") return diffDays <= 14;
        if (timeFilter === "1month") return diffDays <= 30;
        return true;
    });

    // 5. Handlers
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
                    tone: commentDetail.tone || "friendly",
                    authorName: commentDetail.authorName,
                })
            ).unwrap();
            return result.reply;
        } catch (error) {
            console.error("Failed to generate AI reply:", error.message);
            toast.error(error?.message || "Failed to generate AI reply");
            return "";
        }
    };

    const handleApproveReply = async (replyText, commentId) => {
        if (user?.repliesUsed >= user?.repliesLimit) {
            toast.error("You have reached your reply limit.");
            return;
        }
        try {
            await dispatch(postReplyToYoutube({ commentId, replyText })).unwrap();
            toast.success("Reply posted successfully!");
            dispatch(fetchUserProfile());
        } catch (error) {
            toast.error("Failed to post reply.");
            console.error("Failed to approve reply:", error);
        }
    };

    const handleConnectChannel = async () => {
        try {
            const API_BASE_URL =
                import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

            const response = await fetch(`${API_BASE_URL}/youtube/auth-url`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to initiate connection");
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Connect Error:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
        }
    };

    return {
        searchTerm,
        setSearchTerm,
        videos,
        filteredVideos,
        selectedVideoId,
        setSelectedVideoId,
        isLoadingVideos,
        loading, // Comments loading state
        activityComments,
        comments,
        user,
        // filters
        timeFilter,
        setTimeFilter,
        // handlers
        handleGenerateReply,
        handleApproveReply,
        handleConnectChannel,
        fetchChannelVideos,
        isLimitReached: user?.repliesUsed >= user?.repliesLimit
    };
};

