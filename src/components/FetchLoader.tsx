"use client";

const FetchLoader = () => {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="mt-2 text-foreground">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  );
};

export default FetchLoader;
