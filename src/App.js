import {Routes, Route} from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Join from './pages/Join';
import Login from './pages/Login';
import {Provider} from 'react-redux';
import { store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Post from './pages/Post';
import BoardList from './pages/BoardList';
import Board from './pages/Board';
import Chatroom from './pages/Chatroom';
import LiveStream from './components/LiveStream';
import CreateChannel from './pages/CreateChannel';
import StreamingSetting from './pages/StreamingSetting';
import Streaming from './pages/Streaming';
import Live from './pages/Live';
import LiveList from './pages/LiveList';
import LiveRoom from './pages/LiveRoom';
import AuctionRoom from './pages/AuctionRoom';

function App() {
  const persiststore = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persiststore}>
        <Routes>
          <Route element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path='/join' element={<Join/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/post' element={<Post/>}/>
            <Route path='/board-list' element={<BoardList/>}/>
            <Route path='/board/:id' element={<Board/>}/>
            <Route path='/chat' element={<Chatroom/>}/>
            <Route path='/liveList' element={<LiveList />} />
            <Route path="/live/:id" element={<AuctionRoom />} />
            <Route path="/live/streamingSetting/:id" element={<StreamingSetting />} />  {/* 스트리밍 설정 경로 */}
          </Route>
        </Routes>
      </PersistGate>
    </Provider>
  );
}

export default App;
