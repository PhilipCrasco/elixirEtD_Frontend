import { Flex, useMediaQuery } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Header from "./Header";
import Sidebar from "./New-Sidebar";
// import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import PageScrollModalErrorList from "./PageScrollModalErrorList";
import PageScroll from "../utils/PageScroll";

const MainContainer = ({
  notification,
  fetchNotification,
  notificationWithParams,
  fetchNotificationWithParams,
}) => {
  const [navBarData, setNavbarData] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 1100px)");
  const [sidebarHandler, setSidebarHandler] = useState(false);

  const toggleSidebar = () => {
    setSidebarHandler((prev) => !prev);
  };

  useEffect(() => {
    setSidebarHandler(isMobile);
  }, [isMobile]);

  return (
    <Flex bgColor="form" maxHeight="100vh">
      {!sidebarHandler && (
        <Sidebar
          setNavbarData={setNavbarData}
          notification={notification}
          fetchNotification={fetchNotification}
          notificationWithParams={notificationWithParams}
          fetchNotificationWithParams={fetchNotificationWithParams}
        />
      )}
      <Flex flexDirection="column" width="full">
        <Header toggleSidebar={toggleSidebar} />
        {/* <Navbar navBarData={navBarData} /> */}
        <PageScroll maxHeight="100vh">
          <MainContent />
        </PageScroll>
      </Flex>
    </Flex>
  );
};

export default MainContainer;
