import { Box } from "@/infra/baseweb/Box";
// import { SearchBar } from "./components/searchBar";
import { CreditsPill } from "./components/CreditsPill";
// import { ContactUsButton } from "./components/contactUs";
// import { NotificationButton } from "./components/notifications";
import { UserButton } from "./components/user";

const AppTopBar = () => {
  return (
    <Box
      as="header"
      className="sticky top-0 z-20 flex h-14 flex-shrink-0 items-center gap-3.5 border-b bg-surface px-5 border-border"
    >
      {/* <SearchBar /> */}
      <Box className="ml-auto flex items-center gap-3.5">
        <CreditsPill />
        {/* <ContactUsButton /> */}
        {/* <NotificationButton /> */}
        <Box className="h-[22px] w-px bg-border" />
        <UserButton />
      </Box>
    </Box>
  );
};

export default AppTopBar;
