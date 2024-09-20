import React from "react";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "./ui/button";
import { LuMenu } from "react-icons/lu";

const BtnSingUp = () => {
  return (
    <RegisterLink>
      <Button
        variant="default"
        className="items-center hidden gap-2 bg-orange-600 rounded-full w-fit md:flex"
        size="lg"
      >
        <span>Inscription</span>
        <span className="text-xl">
          <LuMenu />
        </span>
      </Button>
    </RegisterLink>
  );
};

export default BtnSingUp;
