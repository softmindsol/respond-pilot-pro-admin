import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function InsightsOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const dispatch = useDispatch();
  // Redux se Token lein (API call ke liye zaroori hai)
  const { token } = useSelector((state) => state.auth);

  // --- 1. Connect Channel Logic ---
  const handleConnectChannel = async () => {
    setIsLoading(true);
    try {
      // Backend URL
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

      // Backend se Auth URL mangwayein
      const response = await fetch(`${API_BASE_URL}/youtube/auth-url`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token lagana na bhulein
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate connection");
      }

      // Agar URL mil gaya, to Google par redirect karein
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Connect Error:", error);
      toast.error(error.message || "Something went wrong. Please try again.", {
        style: {
          background: "#0F0D0D",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      });
      setIsLoading(false);
    }
  };
useEffect(() => {
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  if (success === "channel_connected") {
    // 1. User ko batayen
    toast.success("YouTube Channel Connected Successfully!", {
      style: {
        background: "#0F0D0D",
        color: "#fff",
        border: "1px solid #4ade80",
      },
    });

    // 2. 🔥 Sabse Zaroori: User Profile dobara fetch karein
    // Is se Redux mein `isConnectedToYoutube: true` aa jayega
    dispatch(fetchUserProfile());

    // 3. URL saaf karein
    navigate("/dashboard", { replace: true });
  } else if (error) {
    toast.error("Failed to connect YouTube channel.", {
      style: {
        background: "#0F0D0D",
        color: "#fff",
        border: "1px solid #ef4444",
      },
    });
    navigate("/dashboard", { replace: true });
  }
}, [searchParams, navigate, dispatch]);
  // --- 2. Skip Logic ---
  const handleSkip = () => {
    // Agar skip kiya, to seedha dashboard par bhej dein
    navigate("/dashboard");
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Toaster position="top-right" />

      <div className="max-w-xl w-full text-center animate-in fade-in zoom-in duration-500">
        <h1 className="text-white text-3xl md:text-6xl font-medium font-lato mb-6">
          Insights That <span className="text-orange">Adapt to You</span>
        </h1>

        <p className="text-light text-sm md:text-base mb-12 max-w-xl mx-auto leading-relaxed">
          Gain deeper clarity with insights crafted around your goals, behavior,
          and preferences. Connect your YouTube channel to get started.
        </p>

        <Button
          onClick={handleConnectChannel}
          disabled={isLoading}
          className="w-full max-w-sm mx-auto bg-white hover:bg-gray-200 text-black font-semibold py-6 rounded-lg mb-4 flex items-center justify-center gap-3 font-lato cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-105">
          {isLoading ? (
            <span className="flex items-center gap-2">Connecting...</span>
          ) : (
            <>
              <FcGoogle className="size-7" />
              Connect your Channel
            </>
          )}
        </Button>

        <button
          onClick={handleSkip}
          disabled={isLoading}
          className="text-white bg-dark hover:bg-[#1a1a1a] cursor-pointer max-w-sm w-full py-3.5 rounded-lg transition-colors duration-300 text-sm font-medium font-lato">
          Skip for Now
        </button>
      </div>
    </section>
  );
}
