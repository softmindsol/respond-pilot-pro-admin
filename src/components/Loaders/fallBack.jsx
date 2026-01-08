const FallBack = () => {
  return (
    // <div className="flex h-screen items-center justify-center bg-[#0F0D0D]">
    //   <div className="h-20 w-20 animate-spin rounded-full border-4 border-yellow border-solid border-t-transparent"></div>
    // </div>
    <div className="flex-col gap-4 w-full flex h-screen items-center justify-center">
      <div className="w-20 h-20 border-4 border-transparent text-orange text-4xl animate-spin flex items-center justify-center border-t-orange rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-yellow text-2xl animate-spin flex items-center justify-center border-t-yellow rounded-full"></div>
      </div>
    </div>
  );
};

export default FallBack;
