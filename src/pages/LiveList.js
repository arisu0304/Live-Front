import { Button, Container, Table, TableCell, TableContainer, TableHead, Paper, TableBody, TableRow } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBoards } from '../apis/boardApis';

const LiveList = () => {
    const boards = useSelector(state => state.boardSlice.boards);
    const dispatch = useDispatch();
    const currentUserNickname = useSelector(state => state.memberSlice.nickname); // 현재 로그인한 사용자 닉네임

    useEffect(() => {
        dispatch(getBoards({
            searchCondition: 'all',
            searchKeyword: '',
            page: 0
        }));
    }, [dispatch]);

    const renderButton = (board) => {
        if (board.chatRoomCreated) {
            if (board.nickname === currentUserNickname) {
                // 현재 로그인한 사용자가 작성자(판매자)인 경우
                return (
                    <Button variant="contained" color="primary">
                        <Link to={`/live/streamingSetting/${board.id}`} style={{ color: 'white', textDecoration: 'none' }}>스트리밍 설정</Link>
                    </Button>
                );
            } else {
                // 구매자인 경우
                return (
                    <Button variant="contained" color="primary">
                        <Link to={`/live/${board.id}`} style={{ color: 'white', textDecoration: 'none' }}>입장 가능</Link>
                    </Button>
                );
            }
        } else {
            return (
                <Button variant="outlined" color="secondary" disabled>
                    대기 중
                </Button>
            );
        }
    };

    return (
        <Container maxWidth='xl'>
            <TableContainer component={Paper} style={{ marginTop: '3%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>제목</TableCell>
                            <TableCell>작성자</TableCell>
                            <TableCell>작성일</TableCell>
                            <TableCell>조회수</TableCell>
                            <TableCell>채팅방 상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boards.content && boards.content.map((board, index) =>
                            <TableRow key={index}>
                                <TableCell>{board.id}</TableCell>
                                <TableCell>
                                    <Link to={`/live/${board.id}`}>{board.title}</Link>
                                </TableCell>
                                <TableCell>{board.nickname}</TableCell>
                                <TableCell>{board.regdate.substring(0, board.regdate.indexOf('T'))}</TableCell>
                                <TableCell>{board.cnt}</TableCell>
                                <TableCell>
                                    {renderButton(board)}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default LiveList;
