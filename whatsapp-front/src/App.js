import styled from "styled-components";
import ContactList from "./components/contactlist";
import Conversation from "./components/conversation";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  flex-direction: row;
  align-items: center;
  background: #f8f9fb;
`;

const ChatPlaceholder = styled.img`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  object-fit: contain;
`;
const Placeholder = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  gap: 10px;
  color: rgba(0, 0, 0, 0.45);

  span {
    font-size: 32px;
    color: #525252;
  }
`;

function App(props) {
  const { userInfo } = props;
  const [selectedChat, setChat] = useState();
  const [refreshContactList, toggleRefreshContactList] = useState(false);
  return (
    
     
    <Container>
      <ContactList
        setChat={setChat}
        userInfo={userInfo}
        refreshContactList={refreshContactList}
      />
      {selectedChat ? (
        <Conversation
          selectedChat={selectedChat}
          userInfo={userInfo}
          refreshContactList={() =>
            toggleRefreshContactList(!refreshContactList)
          }
        />
      ) : (
        <Placeholder>
          <ChatPlaceholder src={require("./images/welcome-placeholder.jpeg" )}/>
          <span>Keep your phone connected</span>
          WhatsApp connects to your phone to sync messages.
        </Placeholder>
      )}
    </Container>
  );
}

export default App;
