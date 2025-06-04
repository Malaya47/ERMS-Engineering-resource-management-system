import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface Project {
  _id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[] | string;
  teamSize: number;
  status: string;
}

const statusOptions = ["planning", "active", "completed"];

export default function ProjectManagement() {
  const { register, handleSubmit, reset, setValue } = useForm<Project>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data.projects);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      data.requiredSkills = data.requiredSkills
        .split(",")
        .map((skill: string) => skill.trim());

      if (selectedProjectId) {
        await api.put(`/projects/${selectedProjectId}`, data);
        alert("Project updated!");
      } else {
        await api.post("/projects", data);
        alert("Project created!");
      }

      reset();
      setSelectedProjectId(null);
      fetchProjects();
    } catch (err) {
      console.error("Error submitting project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProjectId(project._id!);
    setValue("name", project.name);
    setValue("description", project.description);
    setValue("startDate", project.startDate.slice(0, 10));
    setValue("endDate", project.endDate.slice(0, 10));
    setValue(
      "requiredSkills",
      Array.isArray(project.requiredSkills)
        ? project.requiredSkills.join(", ")
        : project.requiredSkills
    );
    setValue("teamSize", project.teamSize);
    setValue("status", project.status);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    reset();
    setSelectedProjectId(null);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/projects/${id}`);
      fetchProjects(); // Refresh project list
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 border-none">
      <h2 className="text-4xl font-semibold text-white border-none">
        Project Management
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white text-black p-6 rounded shadow"
      >
        <h3 className="text-xl font-bold mb-2 border-none">
          {selectedProjectId ? "Edit Project" : "Create Project"}
        </h3>

        <div className="border-none">
          <Label className="border-none mb-2">Name</Label>
          <Input {...register("name")} placeholder="Project Name" />
        </div>

        <div className="border-none">
          <Label className="border-none mb-2">Description</Label>
          <Input {...register("description")} placeholder="Short description" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-none">
          <div className="border-none">
            <Label className="border-none mb-2">Start Date</Label>
            <Input type="date" {...register("startDate")} />
          </div>
          <div className="border-none">
            <Label className="border-none mb-2">End Date</Label>
            <Input type="date" {...register("endDate")} />
          </div>
        </div>

        <div className="border-none">
          <Label className="border-none mb-2">Required Skills</Label>
          <Input
            {...register("requiredSkills")}
            placeholder="Comma-separated (e.g. React,Node.js)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-none">
          <div className="border-none">
            <Label className="border-none mb-2">Team Size</Label>
            <Input type="number" {...register("teamSize")} />
          </div>
          <div className="border-none">
            <Label className="border-none mb-2">Status</Label>
            <select
              {...register("status")}
              className="w-full border px-2 py-2 rounded"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {selectedProjectId ? "Update Project" : "Create Project"}
          </Button>
          {selectedProjectId && (
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Project List */}
      <div className="bg-white p-6 rounded shadow border-none">
        <h3 className="text-xl font-bold mb-4 border-none">All Projects</h3>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects yet.</p>
        ) : (
          <div className="space-y-4 border-none">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition"
              >
                <div className="flex justify-between items-start border-none">
                  <div className="space-y-2 border-none">
                    <h4 className="text-xl font-semibold text-gray-800 border-none">
                      {proj.name}
                    </h4>
                    <p className="text-gray-600 border-none">
                      {proj.description}
                    </p>
                    <p className="text-sm text-gray-500 border-none">
                      📅 {format(new Date(proj.startDate), "PPP")} →{" "}
                      {format(new Date(proj.endDate), "PPP")}
                    </p>
                    <p className="text-sm text-gray-500 border-none">
                      👥 Team Size: {proj.teamSize}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2 border-none">
                      {Array.isArray(proj.requiredSkills) &&
                        proj.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 mt-2 border-none">
                      📌 Status: {proj.status}
                    </p>
                  </div>

                  <div className="flex gap-3 items-end border-none">
                    <button
                      onClick={() => handleEdit(proj)}
                      className="text-blue-600 text-sm font-medium hover:underline cursor-pointer border-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id!)}
                      className="text-red-500 text-sm font-medium hover:underline cursor-pointer border-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
