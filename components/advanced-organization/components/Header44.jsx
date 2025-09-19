"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Header44() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="w-full max-w-lg">
          <p className="mb-3 font-semibold md:mb-4">Organize</p>
          <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
            Master Your Notes
          </h1>
          <p className="md:text-md">
            Discover how SynthNote's advanced organization features can
            streamline your note-taking and enhance productivity.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
            <Button title="Learn More">Learn More</Button>
            <Button title="Sign Up" variant="secondary">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
