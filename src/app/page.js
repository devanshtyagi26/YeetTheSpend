import AddData from "@/components/AddData";

export default function Home() {
  return (
    <>
      <div className="flex flex-col relative self-center justify-self-center h-fit gap-[1rem] md:left-0 left-[10rem] md:top-[-5rem] top-[-2rem]">
        {/* Conditionally Render Graphs or Transactions */}
        <div className="border rounded-xl border-accent flex md:flex-row flex-col justify-center items-center md:w-[60vw] w-[90vw] h-fit md:gap-1.5 mt-10 relative shadow-card-foreground shadow-2xl">
          <AddData />
        </div>
      </div>
    </>
  );
}
