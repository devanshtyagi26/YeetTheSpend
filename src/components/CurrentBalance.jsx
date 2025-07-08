"use client";
import React, { useCallback, useState, useEffect } from "react";
import CircularProgressColorDemo from "./progress-10";
import axios from "axios";

export function renderLabel(num) {
  return `Rs. ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
function CurrentBalance({ total, spent }) {
  return (
    <div className="flex px-4 py-1 w-fit h-fit gap-1.5">
      <div>
        <p className="text-2xl montserrat-medium ">Budget</p>
        <CircularProgressColorDemo total={total} spent={spent} />
        <div className="flex items-center justify-between font-bold">
          <div className="flex flex-col justify-center items-center">
            <p className="text-[1.3rem] relative top-1.5">
              {renderLabel(total)}
            </p>
            <p className="text-xs font-medium text-red-500">Monthly Total</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-[1.3rem] relative top-1.5">
              {renderLabel(total - spent)}
            </p>
            <p className="text-xs font-medium text-red-500">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentBalance;
