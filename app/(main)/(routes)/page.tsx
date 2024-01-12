import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <ThemeToggle />
    </div>
  );
};

export default Home;
