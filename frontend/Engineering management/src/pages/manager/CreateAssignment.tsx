// CreateAssignment.tsx
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Engineer {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  name: string;
}

interface FormValues {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  role: string;
}

export default function CreateAssignment() {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEngineers();
    fetchProjects();
    fetchAssignments();
  }, []);

  const fetchEngineers = async () => {
    const res = await api.get("/engineers");
    setEngineers(res.data);
  };

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data.projects);
  };

  const fetchAssignments = async () => {
    const res = await api.get("/assignments");
    setAssignments(res.data.assignments);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/assignments/${editingId}`, data);
        alert("Assignment updated!");
      } else {
        await api.post("/assignments", data);
        alert("Assignment created!");
      }
      reset();
      setEditingId(null);
      fetchAssignments();
    } catch (error) {
      console.error("Error creating/updating assignment", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment: any) => {
    setEditingId(assignment._id);
    setValue("engineerId", assignment.engineerId._id);
    setValue("projectId", assignment.projectId._id);
    setValue("allocationPercentage", assignment.allocationPercentage);
    setValue("role", assignment.role);
    setValue("startDate", assignment.startDate.slice(0, 10));
    setValue("endDate", assignment.endDate.slice(0, 10));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await api.delete(`/assignments/${id}`);
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment", error);
    }
  };

  return (
    <>
      <div className="max-w-2xl min-h-[60vh] mx-auto p-6 bg-white text-black rounded-md shadow-md">
        <h2 className="text-2xl text-center font-semibold mb-6">
          {editingId ? "Edit Assignment" : "Create Assignment"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Engineer Select */}
          <div className="space-y-1">
            <Label className="mb-3">Engineer</Label>
            <Select onValueChange={(value) => setValue("engineerId", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select engineer" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white">
                {engineers.map((eng) => (
                  <SelectItem
                    className="hover:bg-white hover:text-black"
                    key={eng._id}
                    value={eng._id}
                  >
                    {eng.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Select */}
          <div className="space-y-1">
            <Label className="mb-3">Project</Label>
            <Select onValueChange={(value) => setValue("projectId", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white">
                {projects.map((proj) => (
                  <SelectItem
                    className="hover:bg-white hover:text-black"
                    key={proj._id}
                    value={proj._id}
                  >
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Allocation & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Allocation %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                {...register("allocationPercentage")}
                placeholder="e.g. 50"
              />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Input
                type="text"
                {...register("role")}
                placeholder="e.g. Developer"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Start Date</Label>
              <Input type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1">
              <Label>End Date</Label>
              <Input type="date" {...register("endDate")} />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? "Submitting..."
              : editingId
              ? "Update"
              : "Create Assignment"}
          </Button>
        </form>
      </div>

      {/* 📋 Assignment List */}
      <div className="mt-10 text-white">
        <h3 className="text-xl font-bold mb-4">All Assignments</h3>
        {assignments.length === 0 ? (
          <p className="text-white">No assignments found.</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="border p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
              >
                <div>
                  <p className="font-medium">
                    👤 {a.engineerId?.name} | 📁 {a.projectId?.name}
                  </p>
                  <p className="text-sm text-white">
                    {a.role} • {a.allocationPercentage}% •{" "}
                    {a.startDate?.slice(0, 10)} → {a.endDate?.slice(0, 10)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => handleEdit(a)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => handleDelete(a._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
