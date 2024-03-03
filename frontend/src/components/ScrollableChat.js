import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  // Grouping the data by date
  const groupedData = messages.reduce((acc, item) => {
    // Extracting date part from createdAt
    const date = new Date(item.createdAt).toLocaleDateString();
    // Adding the item to corresponding date group
    if (!acc[date]) {
      acc[date] = [item];
    } else {
      acc[date].push(item);
    }

    return acc;
  }, {});


  function getRelativeDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - today.getDay()); // Start of the current week (Sunday)

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else if (date >= startOfWeek && date <= today) {
      return date.toLocaleString("en-us", { day: "long" });
    } else if (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return date.toLocaleString("en-us", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } else {
      return date.toLocaleString("en-us", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }

  console.log(groupedData);

  return (
    <ScrollableFeed>
      {Object.keys(groupedData).map((date) => (
        <div key={date}>
          <h2 style={{display:"flex", justifyContent:"center", marginTop:"5px"}}>{getRelativeDate(date)}</h2>

          {groupedData[date] &&
            groupedData[date].map((m, i) => (
              <div style={{ display: "flex" }} key={m._id}>
                {(isSameSender(groupedData[date], m, i, user._id) ||
                  isLastMessage(groupedData[date], i, user._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(
                      groupedData[date],
                      m,
                      i,
                      user._id
                    ),
                    marginTop: isSameUser(groupedData[date], m, i, user._id)
                      ? 3
                      : 10,
                    borderRadius: "1rem",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {m.content}
                  <small
                    style={{
                      float: "right",
                      fontSize: ".6rem",
                      fontWeight: 400,
                    }}
                  >
                    {new Date(m.createdAt).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </small>
                </span>
              </div>
            ))}
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
