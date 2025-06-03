import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/useAuthStore";
import api from "@/lib/axios";

interface ProfileForm {
  name: string;
  department: string;
  skills: string[]; // not a string
  seniority: string;
  maxCapacity: number;
}

const seniorityLevels = ["junior", "mid", "senior"];

export default function Profile() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const { user, fetchUser } = useAuthStore();
  const { register, handleSubmit, setValue } = useForm<ProfileForm>();

  useEffect(() => {
    if (user) {
      setSkills(user.skills || []);

      setValue("name", user.name || "");
      setValue("department", user.department || "");
      setValue("skills", user.skills?.join(", ") || "");
      setValue("seniority", user.seniority || "");
      setValue("maxCapacity", user.maxCapacity || 100);
    }
  }, [user]);

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      const updated = {
        ...data,
        skills,
      };

      await api.put(`/engineers/${user._id}`, updated);
      alert("Profile updated!");
      fetchUser();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Could not update profile.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 bg-white text-black rounded shadow">
      <h2 className="text-2xl font-semibold border-none">My Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-none">
        <div className="border-none">
          <Label className="border-none mb-2">Name</Label>
          <Input {...register("name")} />
        </div>

        <div className="border-none">
          <Label className="border-none mb-2">Department</Label>
          <Input {...register("department")} />
        </div>

        <div className="border-none">
          <Label className="border-none mb-2">Skills</Label>
          <div className="flex flex-wrap gap-2 mt-1 border-none">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-sm bg-gray-200 rounded flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-red-600 cursor-pointer hover:font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2 border-none">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill"
              className="w-full"
            />
            <Button type="button" onClick={handleAddSkill}>
              Add
            </Button>
          </div>
        </div>

        <div className="border-none">
          <Label className="border-none mb-2">Seniority</Label>
          <select
            {...register("seniority")}
            className="w-full border rounded px-2 py-2"
          >
            {seniorityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="border-none">
          <Label className="border-none mb-2">Max Capacity (%)</Label>
          <Input type="number" min={0} max={100} {...register("maxCapacity")} />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
