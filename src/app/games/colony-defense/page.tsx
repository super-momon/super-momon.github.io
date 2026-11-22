import type { Metadata } from "next";
import ColonyDefenseGame from "./ColonyDefenseGame";

export const metadata: Metadata = {
  title: "Colony Defense Prototype",
  description:
    "Hold a microscopic habitat against a spreading organism in this playable defense-game prototype.",
};

export default function ColonyDefensePage() {
  return <ColonyDefenseGame />;
}
