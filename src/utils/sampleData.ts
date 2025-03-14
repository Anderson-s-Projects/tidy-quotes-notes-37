
import { Folder, Note, Quote, Tag } from "@/types";

export const sampleTags: Tag[] = [
  { id: "tag1", name: "Personal", color: "#3b82f6" },
  { id: "tag2", name: "Work", color: "#10b981" },
  { id: "tag3", name: "Ideas", color: "#8b5cf6" },
  { id: "tag4", name: "Tasks", color: "#f59e0b" },
  { id: "tag5", name: "Reference", color: "#ef4444" }
];

export const sampleFolders: Folder[] = [
  {
    id: "folder1",
    name: "Personal",
    children: [
      { id: "folder1-1", name: "Journal" },
      { id: "folder1-2", name: "Travel" }
    ]
  },
  {
    id: "folder2",
    name: "Work",
    children: [
      { id: "folder2-1", name: "Projects" },
      { id: "folder2-2", name: "Meetings" }
    ]
  },
  { id: "folder3", name: "Ideas" }
];

export const sampleNotes: Note[] = [
  {
    id: "note1",
    title: "Welcome to Notes",
    content: "# Welcome to your new note-taking app\n\nThis is a markdown editor where you can write your notes. Here are some features:\n\n- **Bold text** for emphasis\n- *Italic text* for subtle emphasis\n- Lists for organizing information\n- [Links](https://example.com) to important resources\n\nEnjoy using your new note-taking app!",
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 5, 15),
    tags: [sampleTags[0]],
    folderId: "folder1"
  },
  {
    id: "note2",
    title: "Project Ideas",
    content: "## Project Ideas\n\n1. Mobile app for tracking habits\n2. Website redesign\n3. Integration with calendar\n\n### Priority\nFocus on the mobile app first, then move to the website redesign.",
    createdAt: new Date(2023, 5, 14),
    updatedAt: new Date(2023, 5, 16),
    tags: [sampleTags[1], sampleTags[2]],
    folderId: "folder2-1"
  },
  {
    id: "note3",
    title: "Meeting Notes",
    content: "# Team Meeting - June 12\n\n## Attendees\n- John\n- Sarah\n- Michael\n\n## Agenda\n1. Project status update\n2. Timeline review\n3. Resource allocation\n\n## Action Items\n- [ ] John to finalize design by Friday\n- [ ] Sarah to coordinate with the client\n- [ ] Michael to prepare technical documentation",
    createdAt: new Date(2023, 5, 12),
    updatedAt: new Date(2023, 5, 12),
    tags: [sampleTags[1], sampleTags[3]],
    folderId: "folder2-2"
  },
  {
    id: "note4",
    title: "Travel Plans",
    content: "# Summer Vacation Planning\n\n## Destinations\n- Paris, France\n- Rome, Italy\n- Barcelona, Spain\n\n## Budget\n- Flights: $1200\n- Accommodations: $1500\n- Food & Activities: $1000\n\n## Itinerary\n**Week 1**: Paris\n**Week 2**: Rome\n**Week 3**: Barcelona",
    createdAt: new Date(2023, 5, 10),
    updatedAt: new Date(2023, 5, 18),
    tags: [sampleTags[0]],
    folderId: "folder1-2"
  },
  {
    id: "note5",
    title: "Reading List",
    content: "# Books to Read\n\n1. \"Atomic Habits\" by James Clear\n2. \"Deep Work\" by Cal Newport\n3. \"The Design of Everyday Things\" by Don Norman\n4. \"Thinking, Fast and Slow\" by Daniel Kahneman\n\n## Currently Reading\n\"Atomic Habits\" - Chapter 5",
    createdAt: new Date(2023, 5, 8),
    updatedAt: new Date(2023, 5, 8),
    tags: [sampleTags[0], sampleTags[4]],
    folderId: "folder1"
  }
];

export const sampleQuotes: Quote[] = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs"
  },
  {
    text: "Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible.",
    author: "Don Norman"
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci"
  },
  {
    text: "Genius is one percent inspiration and ninety-nine percent perspiration.",
    author: "Thomas Edison"
  },
  {
    text: "The details are not the details. They make the design.",
    author: "Charles Eames"
  },
  {
    text: "Less, but better – because it concentrates on the essential aspects, and the products are not burdened with non-essentials.",
    author: "Dieter Rams"
  }
];

export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * sampleQuotes.length);
  return sampleQuotes[randomIndex];
};
