import { createFileRoute } from "@tanstack/react-router";
import Booking from "@/components/Booking";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — Merabet Dental Center" },
      { name: "description", content: "Request a dental appointment at Merabet Dental Center. We'll call you to confirm." },
    ],
  }),
  component: Booking,
});
