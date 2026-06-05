import { createFileRoute } from "@tanstack/react-router";
import Home from "@/components/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Merabet Dental Center — Your smile deserves the best care" },
      { name: "description", content: "Modern, gentle dental care for the whole family at Merabet Dental Center. Cleaning, whitening, implants, orthodontics and emergencies." },
      { property: "og:title", content: "Merabet Dental Center" },
      { property: "og:description", content: "Your smile deserves the best care." },
    ],
  }),
  component: Home,
});
