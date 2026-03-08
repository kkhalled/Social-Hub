import React from "react";

import SignUpForm from "../../components/SignUpForm/SignUpForm";
import SignHero from "../../components/SignHero/SignHero";

export default function SignUp() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <SignHero title={"Connect with"} titleMin={"amazing people"} text={"Join millions of users sharing moments, ideas, and building meaningful connections every day."} />
      <SignUpForm />
    </div>
  );
}
