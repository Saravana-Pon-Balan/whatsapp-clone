import styled from "styled-components";
import { useState,useEffect } from "react";
import httpManager from '../managers/httpManager';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1.6;
  height: 100%;
  width: 100%;
  border-right: 1px solid #dadada;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileInfoDiv = styled.div`
  display: flex;
  flex-direction: row;
  background: #ededed;
  padding: 10px;
  width:100%
`;
const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  background: #f6f6f6;
  padding: 10px;
`;
export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 16px;
  width: 100%;
  padding: 5px 10px;
  gap: 10px;
`;
const SearchIcon = styled.img`
  width: 28px;
  height: 28px;
`;
export const SearchInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  font-size: 15px;

`;
const ContactItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
  background: white;
  cursor: pointer;
  :hover {
    background: #ebebeb;
  }
`;
const ProfileIcon = styled(ProfileImage)`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin-left: 12px;
  margin-top: 15px;
  margin-bottom: 15px;
  object-fit: cover;

`;
const ContactInfo = styled.div`
  display:flex;
  flex-direction: column;
  width:100%;
  margin: 0 12px;
`;
const ContactName = styled.span`
  width: 100%;
  font-size: 16px;
  color: black;
`;
const MessageText = styled.span`
  width: 100%;
  font-size: 14px;
  margin-top:3px;
  color:rgba(0,0,0,0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const MessageTime = styled.span`
  font-size: 12px;
  margin-right: 10px;
  color: rgba(0, 0, 0, 0.45);
`;
const SearchResults = styled.div`
  width: 100%;
  height: 100px;
`;
const Logout = styled.button`
  width: 20%;
  margin-left: 70%;
  height: 40px;
 
`;

const ContactComponent = (props) =>{
  const { userData, setChat, userInfo } = props;

  const otherUser =
    userData.channelUsers?.find(
      (userObj) => userObj.email !== userInfo.email
    ) || userData;
  const lastMessage =
    userData.messages && userData.messages.length
      ? userData.messages[userData.messages.length - 1]
      : {};
      
  return( 
    <ContactItem onClick={() => setChat({ channelData: userData, otherUser })}>
    <ProfileIcon src={otherUser?.profilePic} />
    <ContactInfo>
      <ContactName>{otherUser?.name}</ContactName>
      <MessageText>{lastMessage?.text}</MessageText>
    </ContactInfo>
    <MessageTime>
      {" "}
      {lastMessage && new Date(lastMessage?.addedOn).getUTCDate()}
    </MessageTime>
  </ContactItem>
);
};

const ContactList = (props)=>{
  const { userInfo, refreshContactList } = props;
  const [searchString, setSearchString] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [contactList, setContactList] = useState([]);

  const refreshContacts = async () => {
    const contactListData = await httpManager.getChannelList(userInfo.email);
    setContactList(contactListData.data.responseData);
    setSearchString();
    setSearchResult();
  };
  useEffect(() => {
    refreshContacts();
  }, [refreshContactList]);

  const validateEmail = (searchText) => {
      return String(searchText)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{4}))$/ 
        );
    };
    
  const onSearchTextChange=async (searchText)=>{
    setSearchString(searchText);
    if(validateEmail(searchText)) return;
    
    const userData = await httpManager.searchUser(searchText);
    if (userData.data?.success) setSearchResult(userData.data.responseData);
    
  };

    return(
        <Container>
        <ProfileInfoDiv>
            <ProfileImage src={userInfo.picture}></ProfileImage>
            <Logout>Logout</Logout>
        </ProfileInfoDiv>

        <SearchBox>
          <SearchContainer>
            <SearchIcon src="/search-icon.svg"></SearchIcon>
            <SearchInput placeholder="Search email" 
              value={searchString}
              onChange={(e)=>onSearchTextChange(e.target.value)}>

              </SearchInput>
          </SearchContainer>
        </SearchBox>
        {searchResult && (
        <SearchResults>
          <ContactComponent userData={searchResult} setChat={props.setChat} />
        </SearchResults>
      )}
        {contactList.map((userData,index) => (
        <ContactComponent key={index}
          userData={userData}
         setChat={props.setChat}
         userInfo={userInfo}
        />
      ))}

        
        </Container>
    ) ;
}

export default ContactList;