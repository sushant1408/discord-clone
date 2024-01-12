import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <SignUp
      appearance={{
        elements: {
          card: "bg-[#313338]",
          formButtonPrimary: "bg-[#5765f2]",
          footerActionLink: "text-[#00a8fc]",
        },
      }}
    />
  );
};

export default Page;
