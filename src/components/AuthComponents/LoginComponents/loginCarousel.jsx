import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InvertedCommas } from "../../../assets/svgs";

export default function LoginCarousel() {
  return (
    <div className="flex items-center justify-center max-w-96 p-8">
      <div className="">
        {/* Quote Icon */}
        <img src={InvertedCommas} className="mb-3" alt="''" />

        {/* Testimonial Text */}
        <p className="text-white text-base font-normal leading-relaxed mb-6">
          The setup was quick, and within minutes my YouTube channel felt more
          alive. My viewers love the interaction, and I love the peace of mind
        </p>

        {/* Author Section */}
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
              alt="Kevin R"
            />
            <AvatarFallback className="bg-gray-700 text-white text-xl">
              KR
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-white text-base font-semibold">Kevin R</h3>
            <p className="text-light text-sm">Tech Reviewer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
