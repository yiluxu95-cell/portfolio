export type Work = { id: string; title: string; subtitle: string; year: string; image: string; aspect: number };

// Replace image URLs here when the final portfolio assets are ready.
export const films: Work[] = [
  {
    "id": "film-1",
    "title": "After the Rain",
    "subtitle": "Feature film \u00b7 Producer / Art direction",
    "year": "2024",
    "image": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80",
    "aspect": 0.72
  },
  {
    "id": "film-2",
    "title": "Neon Quiet",
    "subtitle": "Short film \u00b7 Writer / Production design",
    "year": "2023",
    "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80",
    "aspect": 1.3
  },
  {
    "id": "film-3",
    "title": "Moth Season",
    "subtitle": "Series \u00b7 Visual development",
    "year": "2023",
    "image": "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1000&q=80",
    "aspect": 0.9
  },
  {
    "id": "film-4",
    "title": "Objects in a Room",
    "subtitle": "Photography \u00b7 Still life studies",
    "year": "2022",
    "image": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=80",
    "aspect": 0.78
  },
  {
    "id": "film-5",
    "title": "Blue Hour Notes",
    "subtitle": "Photography \u00b7 Sydney / Seoul",
    "year": "2022",
    "image": "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=80",
    "aspect": 1.2
  },
  {
    "id": "film-6",
    "title": "Small Gestures",
    "subtitle": "Graphic design \u00b7 Identity system",
    "year": "2021",
    "image": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80",
    "aspect": 0.7
  },
  {
    "id": "film-7",
    "title": "Paper Worlds",
    "subtitle": "Illustration \u00b7 Boards / visual essay",
    "year": "2021",
    "image": "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=80",
    "aspect": 1
  },
  {
    "id": "film-8",
    "title": "The Long Take",
    "subtitle": "Feature film \u00b7 Production design",
    "year": "2020",
    "image": "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1000&q=80",
    "aspect": 0.76
  }
];

const photoSources = [
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1000&q=80",
];

const designSources = [
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1000&q=80",
];

// Placeholder collections are deliberately large; append or replace items freely.
export const photographs: Work[] = Array.from({ length: 40 }, (_, i) => ({
  id: `photo-${i + 1}`, title: `Collected light / ${String(i + 1).padStart(2, "0")}`,
  subtitle: "Photography · Visual diary", year: "",
  image: photoSources[i % photoSources.length], aspect: [0.76, 1.4, 0.9, 1.2, 0.72][i % 5],
}));

export const designs: Work[] = Array.from({ length: 30 }, (_, i) => ({
  id: `design-${i + 1}`, title: `${["Identity study", "Paper worlds", "Set graphics", "Visual essay", "Print study"][i % 5]} / ${String(i + 1).padStart(2, "0")}`,
  subtitle: "Graphic design & illustration", year: "",
  image: designSources[i % designSources.length], aspect: [1.5, 0.65, 1.1, 0.8, 1.35][i % 5],
}));
