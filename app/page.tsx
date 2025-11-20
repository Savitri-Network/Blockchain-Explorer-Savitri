import StatsDashboard from "@/components/StatsDashboard/StatsDashboard";
import ChatDashboard from "@/components/chartDasboard";
import List from "@/components/List/List";

export default function Home() {
  return (
    <>
      <StatsDashboard />
      <List />
      <ChatDashboard />
    </>
  );
}
