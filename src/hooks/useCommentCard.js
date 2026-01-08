import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export const useCommentCard = ({
    id,
    draft,
    comment,
    user,
    status,
    onGenerateReply,
    onApprove,
    isGenerating
}) => {
    const [activeNestedReplyId, setActiveNestedReplyId] = useState(null);
    const [editedDraft, setEditedDraft] = useState(draft || "");
    const [drafts, setDrafts] = useState({});
    const [loadingMap, setLoadingMap] = useState({});
    const [postingMap, setPostingMap] = useState({});
    const hasTriggered = useRef(false);
    const { ref, inView } = useInView({
        triggerOnce: true, // Sirf ek baar trigger ho (bar bar API call na jaye)
        threshold: 0.1, // Jab card 10% dikhne lage
        rootMargin: '0px 0px -50px 0px',

    });


    // --- 🔥 3. AUTO-GENERATE EFFECT ---
    useEffect(() => {
        // Logic: Screen par hai + Pending hai + Draft nahi hai + Generating nahi hai
        if (inView && status === "Pending" && !draft && !isGenerating && !hasTriggered.current) {
            console.log(`Auto-generating for ${user.name} (ID: ${id}) - In View`);
            hasTriggered.current = true;
            onGenerateReply({
                commentId: id,
                commentText: comment,
                authorName: user.name,
            });
        }
    }, [inView, status, draft, isGenerating, id, comment, user.name, onGenerateReply]);
    useEffect(() => {
        if (draft) setEditedDraft(draft);
    }, [draft]);

    const handleGenerateClick = async (targetKey, textContext, authorName) => {
        setLoadingMap((prev) => ({ ...prev, [targetKey]: true }));
        try {
            const generatedText = await onGenerateReply({
                commentId: id, // Always Main ID for tracking
                commentText: textContext,
                authorName: authorName,
            });

            setDrafts((prev) => ({ ...prev, [targetKey]: generatedText }));
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingMap((prev) => ({ ...prev, [targetKey]: false }));
        }
    };

    const handleApproveClick = async (targetKey, text) => {
        setPostingMap((prev) => ({ ...prev, [targetKey]: true }));
        try {
            // Pass Text AND Id
            await onApprove(text, id);
            // Optional: Clear draft after success
            setDrafts((prev) => ({ ...prev, [targetKey]: "" }));
            if (targetKey !== "main") setActiveNestedReplyId(null);
        } catch (e) {
            console.error(e);
        } finally {
            setPostingMap((prev) => ({ ...prev, [targetKey]: false }));
        }
    };

    const buildConversationContext = (targetReply) => {
        return `
    [CONTEXT START]
    1. Main Comment by @${user.name}: "${comment}"
    2. Reply by @${targetReply.author}: "${targetReply.text}"
    [CONTEXT END]
    
    Instruction: Reply specifically to @${targetReply.author} based on the Main Comment context.
    `;
    };

    return {
        ref,
        inView,
        activeNestedReplyId,
        setActiveNestedReplyId,
        editedDraft,
        setEditedDraft,
        drafts,
        loadingMap,
        postingMap,
        handleGenerateClick,
        handleApproveClick,
        buildConversationContext,
    };
};
