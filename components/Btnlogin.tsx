import React from "react";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { LuMenu } from "react-icons/lu";
import { Button } from "./ui/button";

const Btnlogin = () => {
  return (
    <div>
      <LoginLink>
        <Button
          variant="default"
          className="items-center hidden gap-2 bg-green-600 rounded-full w-fit md:flex"
          size="lg"
        >
          <span>Connexion</span>
          <span className="text-xl">
            <LuMenu />
          </span>
        </Button>
      </LoginLink>
    </div>
  );
};

export default Btnlogin;
