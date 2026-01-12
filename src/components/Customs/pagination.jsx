import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pagination = ({
  filteredUsers,
  users,
  page,
  setPage,
  totalPages,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1a1818] border border-[#363A42] rounded-lg px-4 py-3">
      <p className="text-sm text-gray-400">
        Showing{" "}
        <span className="text-white font-medium">{filteredUsers.length}</span>{" "}
        of <span className="text-white font-medium">{users.length}</span> users
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 mr-2">
          Page <span className="text-white font-medium">{page}</span> of{" "}
          <span className="text-white font-medium">{totalPages}</span>
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="border-[#2a2828] text-gray-300 hover:bg-[#252323] hover:text-white disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="border-[#2a2828] text-gray-300 hover:bg-[#252323] hover:text-white disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
