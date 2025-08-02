import Header from "./components/UI/Header";
import ChatButtonWrapper from "./components/chat/ChatButtonWrapper";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-grow flex flex-col">
        <Header />
        <main className="flex-grow p-4">{children}</main>
        <ChatButtonWrapper />
      </div>
    </div>
  );
};

export default Layout;
