import type { UpdateData } from "@/components/Drawer/UpdateItem";

// Placeholder data shown until /api/articles returns live results (Phase D).
export const placeholderUpdates: UpdateData[] = [
  {
    id: "p1",
    source: "WHO",
    title: "Disease Outbreak News bulletin updated for cruise ship cluster",
    ago: "2h",
  },
  {
    id: "p2",
    source: "CDC",
    title: "Agency issues update on hantavirus cruise ship situation",
    ago: "4h",
  },
  {
    id: "p3",
    source: "BBC",
    title: "17 Americans arrive in Nebraska for hantavirus monitoring",
    ago: "6h",
  },
  {
    id: "p4",
    source: "Reuters",
    title: "Spanish nationals flown to Madrid for medical observation",
    ago: "9h",
  },
  {
    id: "p5",
    source: "ECDC",
    title: "European Centre publishes risk assessment for general public",
    ago: "1d",
  },
];
