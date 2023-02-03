import styled from "styled-components";
import EmojiPicker from 'emoji-picker-react';
import React,{ useState ,useRef,useEffect} from "react";
import { SearchContainer,SearchInput } from "./contactlist";
import { messagesList } from "../mockData";
import httpManager from "../managers/httpManager";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  height: 100%;
  width: 100%;
  background: #f6f7f8;
  word-wrap: break-word;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  background: #ededed;
  padding: 10px;
  align-items: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: row;
  background: #ededed;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;
const ContactName = styled.span`
  font-size: 16px;
  color: black;
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: row;
  background: #f0f0f0;
  padding: 10px;
  align-items: center;
  bottom: 0;
`;
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background: #e5ddd6;
`;
const MessageDiv = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isYours ? "flex-end" : "flex-start")};
  margin: 5px 15px;
`;
const Message = styled.div`
  background: ${(props) => (props.isYours ? "#daf8cb" : "white")};
  padding: 8px 10px;
  border-radius: 4px;
  max-width: 50%;
  color: #303030;
  font-size: 14px;
`;

const EmojiImage = styled.img`
  width: 28px;
  height: 28px;
  opacity: 0.4;
  cursor: pointer;
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom:60px;
`;
function Conversation(props) {
  const { selectedChat, userInfo, refreshContactList } = props;
  const [text, setText] = useState("");
  const [pickerVisible, togglePicker] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const inputRef = useRef(null);
  let channelId="";
  useEffect(() => {
    setMessageList(selectedChat.channelData.messages);
  }, [selectedChat]);

  const onEnterPress = async (event) => {
    let channelId = selectedChat.channelData._id;
    if (event.key === "Enter") {
      if (!messageList || !messageList.length) {
        const channelUsers = [
          {
            email: userInfo.email,
            name: userInfo.name,
            profilePic: userInfo.picture,
          },
          {
            email: selectedChat.otherUser.email,
            name: selectedChat.otherUser.name,
            profilePic: selectedChat.otherUser.profilePic,
          },
        ];
        const channelResponse = await httpManager.createChannel({
          channelUsers,
        });
        channelId = channelResponse.data.responseData._id;
      }
      const messages = [...messageList];
      const msgReqData = {
        text,
        senderEmail: userInfo.email,
        addedOn: new Date().getTime(),
      };
      const messageResponse = await httpManager.sendMessage({
        channelId,
        messages: msgReqData,
      });
      messages.push(msgReqData);
      setMessageList(messages);
      setText("");

    }
  };
  refreshContactList();

  useEffect(() => {
    let channelId = selectedChat.channelData._id;

  const getMessage = async()=>{
    const channelRes = await httpManager.getMessage(channelId);
    setMessageList(channelRes.data.responseData[0].messages); 

  }

  const intervalId = setInterval(() => {
    getMessage();
  }, 1000);

  // clean up the interval when the component unmounts
  return () => clearInterval(intervalId);
});

  return (
    <Container>
    <ProfileHeader>
      <ProfileInfo>
        <ProfileImage src={selectedChat.otherUser.profilePic} />
        <ContactName>{selectedChat.otherUser.name}</ContactName>
      </ProfileInfo>
    </ProfileHeader>
    <MessageContainer>
      {messageList?.map((messageData) => (
        <MessageDiv isYours={messageData.senderEmail === userInfo.email}>
          <Message isYours={messageData.senderEmail === userInfo.email}>
            {[messageData.text]}
          </Message>
        </MessageDiv>
      ))}
    </MessageContainer>

    <ChatBox>
      <SearchContainer>
          {pickerVisible && (
          <EmojiPickerWrapper>
            <EmojiPicker onEmojiClick={(emoji) => {
              setText(text+emoji.emoji);
              togglePicker(false);
              inputRef.current.focus();              
          }}
          />
          </EmojiPickerWrapper>
          )}
          <EmojiImage
            src={"/data.svg"}
            onClick={() => togglePicker((pickerVisible) => !pickerVisible)}
          />
          <SearchInput
            placeholder="Type a message"
            value={text}
            ref={inputRef}
            onKeyDown={onEnterPress}
            onChange={(e) => setText(e.target.value)}
          />
        </SearchContainer>
      </ChatBox>
    </Container>
  );
}

export default Conversation;
