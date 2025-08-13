import React from "react";
import Badge from "@/components/atoms/Badge";

const AttendanceStatus = ({ status, onClick, className }) => {
  const statusConfig = {
    present: { label: "Present", variant: "present" },
    absent: { label: "Absent", variant: "absent" },
    late: { label: "Late", variant: "late" },
    excused: { label: "Excused", variant: "excused" }
  };

  const config = statusConfig[status] || { label: "Not Marked", variant: "default" };

  return (
    <Badge 
      variant={config.variant}
      className={`cursor-pointer hover:scale-105 transition-transform ${className}`}
      onClick={onClick}
    >
      {config.label}
    </Badge>
  );
};

export default AttendanceStatus;