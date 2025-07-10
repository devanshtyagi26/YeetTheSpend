import CurrentBalance from "@/components/CurrentBalance";
import Graphs from "@/components/Graphs";
import Navbar from "@/components/Navbar";
import Toggle from "@/components/Toggle";
import Transactions from "@/components/Transactions";

export default function Home() {
  return (
    <>
      <div className="bg-destructive flex justify-start items-center w-[100vw] h-[10vh] p-1.5 text-accent font-bold text-3xl pl-[2rem]">
        YeetTheSpend
      </div>
      <div className="grid grid-cols-[5rem_auto] gap-4">
        <Navbar />
        <div className="flex self-start mt-[3rem] justify-self-center h-fit gap-[2rem]">
          <Toggle />
        </div>
      </div>
    </>
  );
}
