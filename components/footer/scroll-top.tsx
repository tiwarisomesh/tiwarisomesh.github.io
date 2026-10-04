"use client";

import { Button } from "@heroui/react/button";
import { FaArrowUp } from "react-icons/fa";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export function ScrollTop() {
  return (
        <Button
            size="sm"
            variant="ghost"
            className="self-center"
            onClick={scrollToTop}
          >
            <div className="flex items-center gap-2">
              <FaArrowUp className="w-3 h-3" />
              <span>Back to Top</span>
            </div>
        </Button>
  );
}