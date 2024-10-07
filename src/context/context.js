import React, { createContext, useState } from 'react';

export const ChannelContext = createContext();

export const ChannelProvider = ({ children }) => {
  const [channelInfo, setChannelInfo] = useState({});

  return (
    <ChannelContext.Provider value={{ channelInfo, setChannelInfo }}>
      {children}
    </ChannelContext.Provider>
  );
};
