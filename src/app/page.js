import CurrentBalance from "@/components/CurrentBalance";
import Graphs from "@/components/Graphs";
import Navbar from "@/components/Navbar";
import Toggle from "@/components/Toggle";
import Transactions from "@/components/Transactions";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-[5rem_auto] gap-4">
        <Navbar />
        <div className="flex w-[95%] self-center justify-self-center h-fit gap-[2rem]">
          <Toggle />
        </div>
      </div>
    </>
  );
}
