import React from "react";
import CircularProgressColorDemo from "./progress-10";

function CurrentBalance() {
  return (
    <div className="border rounded-xl border-accent flex flex-col p-1 w-fit h-fit">
      <p className="text-2xl montserrat-medium">Budget</p>
      <CircularProgressColorDemo />
      <div className="flex gap-2">
        <div className="flex flex-col">
          <p>Remaining</p>
          <p>3516</p>
        </div>
        <div className="flex flex-col">
          <p>Ehg</p>
          <p>3516</p>
        </div>
      </div>
    </div>
  );
}

export default CurrentBalance;
