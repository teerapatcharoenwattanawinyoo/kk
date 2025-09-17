"use client";

import { useState } from "react";

// ข้อมูลสถานีชาร์จ
const stations = [
  {
    id: 1,
    name: "AIWIN Station",
    status: "online" as const,
    x: 50, // เปอร์เซ็นต์จากซ้ายไปขวา
    y: 50, // เปอร์เซ็นต์จากบนลงล่าง
    address: "Muang Thong Thani Tower, Nonthaburi",
  },
  {
    id: 2,
    name: "Tesla Max",
    status: "online" as const,
    x: 30,
    y: 40,
    address: "Chaengwattana Road, Bangkok",
  },
  {
    id: 3,
    name: "DTC Pack co.,ltd",
    status: "offline" as const,
    x: 70,
    y: 60,
    address: "Pakkret, Nonthaburi",
  },
];

export function SimpleMap() {
  const [activeStation, setActiveStation] = useState<number | null>(null);

  return (
    <div className="relative h-full w-full bg-blue-50">
      {/* แผนที่จำลอง */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        {/* เส้นถนนจำลอง */}
        <path
          d="M0,100 C50,80 100,120 150,100 C200,80 250,120 300,100 C350,80 400,120 400,100"
          stroke="#CBD5E1"
          strokeWidth="2"
        />
        <path
          d="M200,0 C180,50 220,100 200,150 C180,200 220,250 200,300"
          stroke="#CBD5E1"
          strokeWidth="2"
        />

        {/* พื้นที่สีเขียวจำลอง */}
        <circle cx="100" cy="50" r="20" fill="#BBF7D0" fillOpacity="0.5" />
        <circle cx="300" cy="150" r="30" fill="#BBF7D0" fillOpacity="0.5" />

        {/* พื้นที่สีฟ้าจำลอง (แม่น้ำ) */}
        <path
          d="M250,0 C270,50 230,100 250,150 C270,200 230,250 250,300"
          stroke="#BFDBFE"
          strokeWidth="15"
          strokeOpacity="0.5"
        />
      </svg>

      {/* มาร์กเกอร์สถานีชาร์จ */}
      {stations.map((station) => (
        <div
          key={station.id}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
          style={{ left: `${station.x}%`, top: `${station.y}%` }}
          onClick={() =>
            setActiveStation(activeStation === station.id ? null : station.id)
          }
        >
          <div
            className={`h-4 w-4 rounded-full border-2 border-white shadow-md ${
              station.status === "online" ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>

          {/* Popup เมื่อคลิกที่มาร์กเกอร์ */}
          {activeStation === station.id && (
            <div className="absolute left-1/2 top-5 z-20 w-40 -translate-x-1/2 transform rounded bg-white p-2 text-xs shadow-md">
              <div className="font-medium">{station.name}</div>
              <div className="text-[10px] text-gray-500">{station.address}</div>
              <div
                className={
                  station.status === "online"
                    ? "text-[10px] text-green-500"
                    : "text-[10px] text-red-500"
                }
              >
                {station.status === "online" ? "Online" : "Offline"}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
