
import styled from "@emotion/styled";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import React, { useEffect, useState } from "react";

const BE_URL = process.env.REACT_APP_BACKEND_URL;

interface GameResult {
  index: number;
  score: number;
}

function ScoreRate(props: {
  mark: string;
  examiners: string;
  channelId: string;
}) {
  const [participantList, setParticipantList] = useState(new Map());
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);
  const [orderList, setOrderList] = useState<string[]>([]);
  const [examinerList, setExaminerList] = useState<string[]>([]);
  const [score,setScore] =useState<number[]>([]);

  const getParticipantList = (channelId: string) => {
    axios.get(`${BE_URL}/api/channels/info/${channelId}`)
    .then((res) => {
      let temp = res.data.participantList;
        
      temp.map((object: { nickName: ""; channelId: ""; connectionId: "" }) => {
        setParticipantList((prev)=> new Map(prev).set(object.connectionId, object.nickName));
      });
    });
  };
  const getOrderList =(examinerList:string[])=>{
    let order = [...orderList];
      
    examinerList.map((val,index)=>{
        let name = participantList.get(val);
        
        order[index]=name;

  
    })
      setOrderList(order);
  }
  const setDataArray=(examiners:string, mark:string)=>{
    examiners.split(',').map((val,index)=>{
      examinerList[index] =val;
    });
    setExaminerList(examinerList);
    
    mark.split(',').map((val,index)=>{
      score[index] =Number(val);
    });
    setScore(score);
  }

  useEffect(() => {
    setDataArray(props.examiners,props.mark);
    getParticipantList(props.channelId);
  }, []);

  useEffect(()=>{
    getOrderList(examinerList);
  },[participantList])


  
  const sort = (obj: any) => {
    let items = Object.keys(obj).map(function (key) {
      return [key, obj[key]];
    });

    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    let sorted_obj: GameResult[] = [];
    let idx = 0;
    items.forEach(function (val, index) {
      sorted_obj[idx] = { index: val[0], score: val[1] };
      idx++;
    });
    return sorted_obj;
  };

  // let scoreList = props.score;
  let index = 0;

  let dic: { [index: number]: number } = {};
  score.map(function (num) {
    dic[index++] = num;
  });

  let result;
  result = sort(dic);
  

  return (
    <Container>
      <RankDialog
          fullWidth
          open={open}
          onClose={handleClose}
          // TransitionComponent={Transition}
          aria-labelledby="form-dialog-title"
        >
          <RankDialogTitle id="form-dialog-title">
            <Title>
              <span>
            랭킹
            </span>
            </Title>
          </RankDialogTitle>
          <RankDialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <CustomTableCell align="center"> <span>순위 </span></CustomTableCell>
                    <CustomTableCell align="center"> <span>닉네임 </span></CustomTableCell>
                    <CustomTableCell align="center"> <span>개수 </span></CustomTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.map((val, idx) => {
                    return (
                      <TableRow key={idx}>
                        <BodyTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {idx + 1 === 1 && '🥇'}
                          {idx + 1 === 2 && '🥈'}
                          {idx + 1 === 3 && '🥉'}
                          <span>
                          {idx + 1 >= 4 && idx + 1}
                          </span>
                        </BodyTableCell>
                        <BodyTableCell align="center">
                          <span>
                          {orderList[val.index]}
                          </span>
                        </BodyTableCell>
                        <BodyTableCell align="center">
                          <span>
                          {val.score}
                          </span>
                        </BodyTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <RankDialogActions>
              <CancelButton
                onClick={() => {
                  handleClose();
                }}
              />
            </RankDialogActions>
          </RankDialogContent>
        </RankDialog>
    </Container>
  );
}

const Container = styled.div``;

const RankDialogContent = styled(DialogContent)`
  display: flex;
  color: black;
  flex-direction: column;
  background-color: white;
`;

const RankDialogContentText = styled(DialogContentText)``;

const RankDialogActions = styled(DialogActions)`
  flex-direction: row;
`;

const RankRecordContainer = styled(Table)`
  color: black;
  display: flex;
`;
// modal
const RankDialog = styled(Dialog)`
  opacity: 0.97;
  padding: 0 50px 0 100px;
  & .MuiPaper-rounded {
    border-radius: 15px;
  }
`;

const RankDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: center;
  background-color: #white;
  padding-bottom: 0;
  & > .MuiTypography-root {
    display: flex;
    align-items: center;
  }
`;
const CustomTableCell = styled(TableCell)`
  font-size: 1.2rem;
`;
const CancelButton = styled(CloseIcon)`
  cursor: pointer;
  color: black;
  justify-self: flex-end;
`;
const BodyTableCell = styled(TableCell)`
  font-size: 1.5rem;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 2rem;
  color: black;
  margin-bottom: 40px;
`;

export default ScoreRate;