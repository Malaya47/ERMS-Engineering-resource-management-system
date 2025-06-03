import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

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

export default function MyAssignments() {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (user?._id) {
      fetchAssignments(user._id);
    }
  }, [user]);

  const fetchAssignments = async (engineerId: string) => {
    const res = await api.get("/assignments");
    const myAssignments = res.data.assignments.filter(
      (a: any) => a.engineerId._id === engineerId
    );

    // Map project details into assignment
    const withProjectDetails = await Promise.all(
      myAssignments.map(async (a: any) => {
        const projectRes = await api.get(`/projects/${a.projectId._id}`);
        return {
          ...a,
          project: projectRes.data.project,
        };
      })
    );

    setAssignments(withProjectDetails);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 border-none">
      <h2 className="text-2xl font-semibold text-white border-none">
        My Assignments
      </h2>
      {/* <AssignmentCalendar assignments={assignments} /> */}
      {assignments.length === 0 ? (
        <p className="text-gray-500">You have no current assignments.</p>
      ) : (
        assignments.map((a) => (
          <div
            key={a._id}
            className="bg-white text-black border rounded p-4 shadow space-y-2"
          >
            <h3 className="text-lg font-bold border-none">{a.project.name}</h3>
            <p className="text-sm text-gray-600 border-none">
              {a.project.description}
            </p>
            <p className="text-sm border-none">📌 Status: {a.project.status}</p>
            <p className="text-sm border-none">🧑‍💻 Role: {a.role}</p>
            <p className="text-sm border-none">
              📊 Allocation: {a.allocationPercentage}%
            </p>
            <p className="text-sm border-none">
              📅 {format(new Date(a.startDate), "PPP")} →{" "}
              {format(new Date(a.endDate), "PPP")}
            </p>

            <Progress
              value={a.allocationPercentage}
              className="h-2 bg-blue-500"
            />
          </div>
        ))
      )}
    </div>
  );
}
