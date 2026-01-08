import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const generateAiReply = createAsyncThunk(
    "youtube/generateAiReply",
    async ({ commentId, commentText, tone = "professional", authorName }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;

            // Assuming the endpoint structure based on previous patterns
            const response = await axios.post(
                `${API_BASE}/ai/generate-reply`,
                {
                    comment: commentText,
                    tone: tone,
                    authorName,
                    draftOnly: true // Batayen ke ye sirf draft hai (usage count na ho)

                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return {
                commentId, reply: response.data.reply || response.data.data || response.data, aiStatus: response.data.status
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const postReplyToYoutube = createAsyncThunk(
    "youtube/postReplyToYoutube",
    async ({ commentId, replyText }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const user = auth.user;

            const response = await axios.post(
                `${API_BASE}/youtube/reply`,
                {
                    commentId,
                    commentText: replyText
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return { commentId, reply: replyText, user };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    comments: [],
    nextPageToken: null, // Token store karne ke liye
    totalResults: 0,
    loading: false,
    loadingMore: false, // Sirf button ki loading ke liye

};

const youtubeSlice = createSlice({
    name: "youtube",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setLoadingMore: (state, action) => {
            state.loadingMore = action.payload;
        },

        // 1. Initial Load (Reset list)
        setComments: (state, action) => {
            state.comments = action.payload.comments;
            state.nextPageToken = action.payload.nextPageToken;
            state.totalResults = action.payload.pageInfo?.totalResults;
        },

        // 2. Load More (Append list)
        appendComments: (state, action) => {
            // Duplicates se bachne ke liye filter (Optional but safe)
            const newComments = action.payload.mappedComments.filter(
                (newC) => !state.comments.some((oldC) => oldC.id === newC.id)
            );

            state.comments = [...state.comments, ...newComments];
            state.nextPageToken = action.payload.nextPageToken;
        },

        // Video change hone par state clear karein
        resetComments: (state) => {
            state.comments = [];
            state.nextPageToken = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateAiReply.pending, (state, action) => {
                const { commentId } = action.meta.arg;
                const comment = state.comments.find((c) => c.id === commentId);
                if (comment) {
                    comment.isGenerating = true;
                    comment.draft = ""; // Clear old draft
                }
            })
            .addCase(generateAiReply.fulfilled, (state, action) => {
                const { commentId, reply, aiStatus } = action.payload;
                const comment = state.comments.find((c) => c.id === commentId);
                if (comment) {
                    comment.isGenerating = false;

                    // 1. Fix [object Object] issue
                    let cleanReply = reply;
                    if (typeof reply === 'object' && reply !== null) {
                        cleanReply = reply.reply || reply.text || "";
                    }

                    // 2. If Flagged, keep draft EMPTY
                    if (aiStatus === 'flagged') {
                        comment.draft = "";
                    } else {
                        comment.draft = cleanReply;
                    }

                    comment.isFlagged = aiStatus === 'flagged';
                }
            })
            .addCase(generateAiReply.rejected, (state, action) => {
                const { commentId } = action.meta.arg;
                const comment = state.comments.find((c) => c.id === commentId);
                if (comment) {
                    comment.isGenerating = false;
                    comment.draft = ""; // Reset on error
                }
            })

            // Post Reply Lifecycle
            .addCase(postReplyToYoutube.pending, (state, action) => {
                const { commentId } = action.meta.arg;
                const comment = state.comments.find((c) => c.id === commentId);
                if (comment) {
                    comment.isPosting = true;
                }
            })
            .addCase(postReplyToYoutube.fulfilled, (state, action) => {
                const { commentId, reply, user } = action.payload;
                const comment = state.comments.find((c) => c.id === commentId);
                if (comment) {
                    comment.isPosting = false;
                    comment.status = "Replied";
                    comment.reply = reply; // Ensure the reply text is set
                    comment.draft = null;  // Draft clear karein

                    // Add to replies list locally for immediate feedback
                    if (!comment.replies) comment.replies = [];

                    const userImage = user.profileImage
                        ? (user.profileImage.startsWith("http") ? user.profileImage : `${import.meta.env.VITE_PROFILE_FETCH}/${user.profileImage}`)
                        : null;

                    comment.replies.push({
                        id: Date.now().toString(), // Temp ID
                        author: user.name || "You",
                        authorImage: userImage,
                        text: reply,
                        publishedAt: new Date().toISOString(),
                        isOwner: true
                    });
                }
            })
            .addCase(postReplyToYoutube.rejected, (state, action) => {
                const { commentId } = action.meta.arg;
                const comment = state.comments.find((c) => c.id === commentId);
                if (comment) {
                    comment.isPosting = false;
                }
                state.error = action.payload;
            });
    },
});

export const { setComments, appendComments, setLoading, setLoadingMore, resetComments } = youtubeSlice.actions;
export default youtubeSlice.reducer;
