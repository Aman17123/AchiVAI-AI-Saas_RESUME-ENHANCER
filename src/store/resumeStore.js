import { create } from "zustand";

// Deep clone helper (safer than shallow spreads)
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const useResumeStore = create((set, get) => ({
  data: {},

  // 🔥 Load template into store safely
  setFullData: (newData) =>
    set(() => ({
      data: deepClone(newData),
    })),

  // 🔥 Update a simple field: name, email, phone, etc.
  updateField: (field, value) =>
    set((state) => ({
      data: { ...state.data, [field]: value },
    })),

  // 🔥 Update a field inside an array: experience[0].title
  updateArrayField: (field, index, key, value) =>
    set((state) => {
      const cloned = deepClone(state.data);
      if (!Array.isArray(cloned[field])) cloned[field] = [];

      if (!cloned[field][index]) cloned[field][index] = {};

      cloned[field][index][key] = value;

      return { data: cloned };
    }),

  // 🔥 Add an item to an array (experience, education, projects, etc.)
  addArrayItem: (field, emptyObj) =>
    set((state) => {
      const cloned = deepClone(state.data);
      if (!Array.isArray(cloned[field])) cloned[field] = [];
      cloned[field].push(emptyObj);
      return { data: cloned };
    }),

  // 🔥 Remove an item from an array
  removeArrayItem: (field, index) =>
    set((state) => {
      const cloned = deepClone(state.data);
      if (!Array.isArray(cloned[field])) return { data: cloned };
      cloned[field].splice(index, 1);
      return { data: cloned };
    }),

  // 🔥 Move item in array (UP/DOWN buttons)
  moveArrayItem: (field, fromIndex, toIndex) =>
    set((state) => {
      const cloned = deepClone(state.data);
      if (!Array.isArray(cloned[field])) return { data: cloned };

      const arr = cloned[field];
      if (toIndex < 0 || toIndex >= arr.length) return { data: cloned };

      const [item] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, item);

      cloned[field] = arr;
      return { data: cloned };
    }),

  // 🔥 Save snapshot for autosave or export
  snapshot: () => deepClone(get().data),

  // 🔥 Save resume to localStorage
  saveResume: async (resumeData) => {
    try {
      localStorage.setItem("resume_saved", JSON.stringify(resumeData));
      return true;
    } catch {
      return false;
    }
  },
}));
