export interface PetConfig {
  id: string;
  name: string;
  species: string;
  personality: string;
  styleDescription: string;
}

export interface MemoryEntry {
  role: "user" | "assistant" | "pet";
  sender: string;
  content: string;
  timestamp: number;
}
