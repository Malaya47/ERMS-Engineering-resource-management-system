import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

interface Assignment {
  _id: string;
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  project: {
    name: string;
    description: string;
    status: string;
  };
}

export default function AssignmentCalendar({
  assignments,
}: {
  assignments: Assignment[];
}) {
  const tileContent = ({ date }: { date: Date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const matchedAssignments = assignments.filter(
      (a) =>
        formattedDate >= format(new Date(a.startDate), "yyyy-MM-dd") &&
        formattedDate <= format(new Date(a.endDate), "yyyy-MM-dd")
    );

    return matchedAssignments.length > 0 ? (
      <div className="text-xs text-blue-400">
        {matchedAssignments.map((a) => (
          <div key={a._id}>{a.project.name}</div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="p-6 ">
      <h2 className="text-xl font-semibold">Assignment Calendar</h2>
      <Calendar tileContent={tileContent} />
    </div>
  );
}
