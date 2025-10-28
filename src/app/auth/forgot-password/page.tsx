import ForgotPassword from "@/pages/Auth/ForgorPassword/ForgotPassword";
import React from "react";

const page = () => {
  return( <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <ForgotPassword />
        </div>
      </div>);
};

export default page;
