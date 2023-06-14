import React, { useState } from "react";
import { Container, Paper, Tabs, Tab } from "@mui/material";
import { Inbox as InboxIcon, Menu as MenuIcon } from "@mui/icons-material";
import BookingResult from "../bookings/BookingResult";
import UserInfo from "./UserInfo";
import { getUserId } from "../auth/authAPI";

// interface ProfileProps {
//   userID: number;
// }

const UserProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const userID = Number(getUserId());

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container
      maxWidth={false} // Remove the maxWidth restriction
      sx={{
        width: "100%", // Set the width to 100%
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: 0,
        marginRight: 0,
      }}
    >
      <Paper>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="email categories"
          sx={{
            "width": "100%", // Set the width to 100%
            "& .MuiTab-root": {
              fontSize: "1.2rem", // Set the font size for the tabs
            },
          }}
        >
          <Tab label="個人檔案" />
          <Tab label="預訂歷史" />
          <Tab label="我的最愛" />
          {/* Add more Tab components for other categories */}
        </Tabs>
        {selectedTab === 0 && (
          <div>
            <UserInfo />
          </div>
        )}
        {selectedTab === 1 && (
          <div>
            <BookingResult userID={userID} />
          </div>
        )}
        {selectedTab === 2 && <div>Others</div>}
        {/* Add more content for other categories */}
      </Paper>
    </Container>
  );
};

export default UserProfile;
