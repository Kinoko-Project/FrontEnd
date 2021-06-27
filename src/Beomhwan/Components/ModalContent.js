import styled from 'styled-components';
import {flexAlign} from '../../Util/css';
import {NotoSansRegular, NotoSansLight} from '../css/cssModule';
import {Chart as PyogoChart} from '../Routes/Pyogo';
import {BaekhwagoChart as BaekhwaChart} from '../Routes/Baekhwago';
import { useKinokoState } from '../../KinokoContext';

// ---------모달 스타일--------------
export const ModalTitleBox = styled.div`
    ${flexAlign}
    ${NotoSansRegular}
    width: 100%;
    height: 40px;
    user-select: none;
    font-size: 1.2em;
`;

export const ModalTextBox = styled.p`
    ${flexAlign}
    ${NotoSansLight}
    width: 100%;
    height: 30px;
`;

const ModalEnvText = styled.p`
    ${NotoSansLight}
    width: 100%;
    height: 30px;
    margin: 0 0 0 20px;
`;

const ModalContentBox = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const ModalChartBox = styled.div`
    width: 70%;
    height: 55vh;
`;

const ModalEnvInfoBox = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
`;

export const ModalFooter = styled.div`
    width: 100%;
    height: 60px;
    margin-top: 20px;
    ${flexAlign}
`;

export const Button = styled.button`
    ${NotoSansRegular}
    width: 80px;
    height: 50px;
    margin: 0 10px 0 10px;
    background-color: white;
    border: 1px solid #dddddd;
    border-radius: 10px;
    &:focus{
        outline: none;
    };
    cursor: pointer;
    color: rgba(0,0,0,0.7);
`;

const ProgramRunningContentBox = styled.div`
    width: 100%;
    height: 100%;
    ${flexAlign};
    ${NotoSansRegular};
    font-size: 1.4em;
`;

// =========모달 스타일==============

const ModalContent = ({chartname, text, onClose}) => {
    const state = useKinokoState();
    console.log(text);
    const {data: programInfo} = state.programInfo;

    if(programInfo) {
        return (
            <>
                <ModalTitleBox>
                    実行中のプログラムがあります！
                </ModalTitleBox>
                <ProgramRunningContentBox>
                    プログラム : {programInfo[0].prg_name}
                </ProgramRunningContentBox>
                <ModalFooter>
                    <Button onClick={onClose}> 確認 </Button>
                    <Button onClick={onClose}> キャンセル </Button>
                </ModalFooter>
            </>
        )
    }

    return (
        <>
        <ModalTitleBox>
            {text.title}
        </ModalTitleBox>
        <ModalTextBox>
            {text.caution1}
        </ModalTextBox>
        <ModalTextBox>
            {text.caution2}
        </ModalTextBox>
        <ModalContentBox>
            <ModalChartBox>
                {chartname === 'pyogo' ? <PyogoChart /> : <BaekhwaChart/>}
            </ModalChartBox>
            <ModalEnvInfoBox>
                <ModalEnvText>
                    {chartname === 'pyogo' ? text.sunText : ''}
                </ModalEnvText>
                <ModalEnvText>  
                    {chartname === 'pyogo' ? text.waterText : ''}
                </ModalEnvText>
            </ModalEnvInfoBox>
        </ModalContentBox>
        <ModalFooter>
            <Button onClick={onClose}> 適用 </Button>
            <Button onClick={onClose}> キャンセル </Button>
        </ModalFooter>
        </>
    );
}

export default ModalContent;