"use client";

import { COLOMBIA, DEPARTMENTS } from "@/lib/colombia";

interface Props {
  city: string;
  department: string;
  onCityChange: (city: string) => void;
  onDepartmentChange: (dept: string) => void;
}

export default function CityPicker({ city, department, onCityChange, onDepartmentChange }: Props) {
  const cities = department ? COLOMBIA[department] ?? [] : [];

  function handleDeptChange(newDept: string) {
    onDepartmentChange(newDept);
    onCityChange(""); // reset city when dept changes
  }

  return (
    <div className="flex gap-2">
      <select
        value={department}
        onChange={e => handleDeptChange(e.target.value)}
        className="flex-1 px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
      >
        <option value="">Departamento</option>
        {DEPARTMENTS.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        value={city}
        onChange={e => onCityChange(e.target.value)}
        disabled={!department}
        className="flex-1 px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Ciudad</option>
        {cities.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
