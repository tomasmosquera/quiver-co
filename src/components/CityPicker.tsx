"use client";

import { useState, useEffect } from "react";
import { COLOMBIA, DEPARTMENTS } from "@/lib/colombia";

interface Props {
  value: string; // "Ciudad, Departamento" o solo ciudad
  onChange: (city: string) => void;
}

function parseCurrent(value: string): { dept: string; city: string } {
  if (!value) return { dept: "", city: "" };
  const parts = value.split(", ");
  if (parts.length === 2) return { dept: parts[1], city: parts[0] };
  // Legacy: solo ciudad
  for (const [dept, cities] of Object.entries(COLOMBIA)) {
    if (cities.includes(value)) return { dept, city: value };
  }
  return { dept: "", city: value };
}

export default function CityPicker({ value, onChange }: Props) {
  const { dept: initDept, city: initCity } = parseCurrent(value);
  const [dept, setDept] = useState(initDept);
  const [city, setCity] = useState(initCity);

  const cities = dept ? COLOMBIA[dept] ?? [] : [];

  useEffect(() => {
    if (city && dept) onChange(`${city}, ${dept}`);
    else if (city)    onChange(city);
    else              onChange("");
  }, [dept, city]);

  function handleDeptChange(newDept: string) {
    setDept(newDept);
    setCity("");
  }

  return (
    <div className="flex gap-2">
      <select
        value={dept}
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
        onChange={e => setCity(e.target.value)}
        disabled={!dept}
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
