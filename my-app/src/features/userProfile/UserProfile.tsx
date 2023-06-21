import React, { useState } from "react";
import { Container, Paper, Tabs, Tab, Box } from "@mui/material";
import BookingResult from "../bookings/BookingResult";
import { getUserId } from "../auth/authAPI";
import UserInfo from "./UserInfo";
import UserUpdate from "./UserUpdate";
import Favorite from "../favorite/Favorite";

const UserProfile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const userID = Number(getUserId());

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleEditComplete = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Container
      maxWidth={false} // Remove the maxWidth restriction
      sx={{
        width: "100%",
        height: "70%",
        paddingBottom: 50,
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
            "width": "100%",
            "& .MuiTab-root": {
              fontSize: "1.2rem", // Set the font size for the tabs
              marginBottom: "", // Remove the bottom margin for the tabs
            },
          }}
        >
          <Tab label="個人檔案" />
          <Tab label="預訂歷史" />
          <Tab label="我的最愛" />
          {/* Add more Tab components for other categories */}
        </Tabs>
        {selectedTab === 0 && (
          <Box pb={3}>
            {" "}
            {/* Add Box wrapper with padding-bottom of 30px */}
            <div>
              {!isEditing ? (
                <UserInfo onEditComplete={handleEditComplete} />
              ) : (
                <UserUpdate onEditComplete={handleEditComplete} />
              )}
            </div>
          </Box>
        )}
        {selectedTab === 1 && (
          <Box pb={3}>
            {" "}
            <div>
              <BookingResult userID={userID} />
            </div>
          </Box>
        )}

        {selectedTab === 2 && (
          <Box pb={3}>
            <div>
              <Favorite userID={userID} />
            </div>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;
