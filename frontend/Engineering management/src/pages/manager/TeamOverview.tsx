import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Progress } from "@/components/ui/progress"; // Install this with shadcn
import { Badge } from "@/components/ui/badge"; // Optional for skill tags

interface Engineer {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  seniority: string;
  maxCapacity: number;
}

export default function TeamOverview() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [capacityMap, setCapacityMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    const res = await api.get("/engineers");
    setEngineers(res.data);

    // For each engineer, fetch their capacity
    res.data.forEach(async (eng: Engineer) => {
      const capRes = await api.get(`/engineers/${eng._id}/capacity`);
      setCapacityMap((prev) => ({
        ...prev,
        [eng._id]: capRes.data.totalAllocated,
      }));
    });
  };

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <h1 className="text-4xl font-semibold mb-6 border-0">Team Overview</h1>

      <div className="space-y-4 border-0">
        {engineers.map((eng) => {
          const allocated = capacityMap[eng._id] ?? 0;
          const available = eng.maxCapacity - allocated;

          return (
            <div
              key={eng._id}
              className=" border p-4 rounded-lg shadow-md bg-black text-white"
            >
              <div className="flex justify-between items-center border-0">
                <h2 className="text-lg font-bold border-0">{eng.name}</h2>
                <p className="text-sm text-gray-400 border-0">{eng.email}</p>
              </div>

              <p className="text-sm text-gray-300 border-0">
                🏆 Seniority: {eng.seniority} • Max Capacity: {eng.maxCapacity}%
              </p>

              {/* Skills with better contrast */}
              <div className="flex flex-wrap gap-2 mt-2 border-0">
                {eng.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Progress Bar - Adjusted for Dark Theme */}
              <div className="mt-3 border-0">
                <h3 className="text-sm font-semibold border-0 mb-2">
                  Capacity
                </h3>
                <p className="text-sm text-gray-300 border-0 mb-2">
                  🔴 Allocated: {allocated}% • 🟢 Available: {available}%
                </p>
                <Progress
                  value={(allocated / eng.maxCapacity) * 100}
                  className="bg-green-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
