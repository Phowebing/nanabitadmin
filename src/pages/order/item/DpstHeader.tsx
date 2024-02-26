import {
  BigKeyword,
  Common,
  MainTitle,
  MiddleInput,
  SearchButton,
  SmallButton,
  SubTitle,
} from "../../../styles/AdminBasic";
import styled from "@emotion/styled";
import OrderAllSelect from "../../../components/order/orderSlect/OrderAllSelect";
import { useState } from "react";
import OrPicker from "../../../components/order/orderSlect/OrPicker";
import { Dayjs } from "dayjs";

const Wrap = styled.div`
  margin-bottom: 30px;
  border-bottom: 2px solid ${Common.color.primary};
`;
interface OrAllHeaderProps {}
const DpstHeader: React.FC<OrAllHeaderProps> = () => {
  const [periodBt, setPeriodBt] = useState(0); // 선택된 기간 상태 버튼관리
  const [searchOp, setSearchOp] = useState(0); // 검색어 상태 옵션관리
  const [searchText, setSearchText] = useState<string>(""); //  주문상태 옵션관리
  const [selectedDate, setSelectedDate] = useState<string[]>([]); // Date picker 관리
  const [userSearchActive, setUserSearchActive] = useState(false); //  주문상태 옵션관리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // 기간버튼 핸들러
  const handlePeriodBt = (BTIndex: number) => {
    setPeriodBt(BTIndex);
    // 선택된 기간에 따른 동작 수행
    console.log("선택된 기간:", BTIndex);
  };

  // DATE picker 범위 업데이트
  const handleDateChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[],
  ) => {
    setSelectedDate(dateStrings);
  };

  // 검색 버튼 클릭시 처리
  const handleClickSearch = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setPeriodBt(0);
    setSearchOp(0);

    // 사용자는 검색을 했다.
    setUserSearchActive(true);
    // fetchData();
    console.log(
      "검색버튼눌렀어융",
      periodBt,
      searchOp,
      searchText,
      selectedDate,
    );
  };

  // 검색어 셀렉함수
  const handleSearchOp = (optionIndex: number): void => {
    switch (optionIndex) {
      case 0:
        // 주문상태 전체보기에 대한 동작 수행
        setSearchOp(0);
        break;
      case 1:
        // 입금대기에 대한 동작 수행
        setSearchOp(1);
        break;
      case 2:
        // 배송준비중에 대한 동작 수행
        setSearchOp(2);
        break;
      case 3:
        // 배송중에 대한 동작 수행
        setSearchOp(3);
        break;
      case 4:
        // 배송완료에 대한 동작 수행
        setSearchOp(4);
        break;
      case 5:
        // 취소에 대한 동작 수행
        setSearchOp(5);
        break;
      case 6:
        // 반품에 대한 동작 수행
        setSearchOp(6);
        break;
      default:
        break;
    }
    console.log("검색어", optionIndex);
  };

  return (
    <>
      <Wrap>
        <MainTitle>입금대기</MainTitle>
        <SubTitle>기본검색</SubTitle>
        <div style={{ marginBottom: "20px" }}>
          <BigKeyword
            style={{ borderTop: `1px solid ${Common.color.primary}` }}
          >
            <div className="left">검색어</div>
            <div className="right">
              <OrderAllSelect
                option1="전체보기"
                option2="주문번호"
                option3="일련번호"
                option4="회원아이디"
                option5="주문자명"
                option6="입금자명"
                option7="수령자명"
                option8="수령자 핸드폰"
                onClick={handleSearchOp}
              />
              <MiddleInput
                type="text"
                placeholder="검색어를 입력하세요"
                autoFocus
                value={searchText}
                onChange={handleInputChange}
              />
            </div>
          </BigKeyword>
          <BigKeyword>
            <div className="left">기간검색</div>
            <div className="right">
              <OrPicker onDateChange={handleDateChange} />
              <SmallButton
                style={{ marginRight: "5px", minWidth: "40px" }}
                onClick={() => handlePeriodBt(0)}
              >
                오늘
              </SmallButton>
              <SmallButton
                style={{ marginRight: "5px", minWidth: "40px" }}
                onClick={() => handlePeriodBt(1)}
              >
                어제
              </SmallButton>
              <SmallButton
                style={{ marginRight: "5px", minWidth: "40px" }}
                onClick={() => handlePeriodBt(2)}
              >
                일주일
              </SmallButton>
              <SmallButton
                style={{ marginRight: "5px", minWidth: "40px" }}
                onClick={() => handlePeriodBt(3)}
              >
                지난달
              </SmallButton>
              <SmallButton
                style={{ marginRight: "5px", minWidth: "40px" }}
                onClick={() => handlePeriodBt(4)}
              >
                1개월
              </SmallButton>
              <SmallButton
                style={{ marginRight: "5px", minWidth: "40px" }}
                onClick={() => handlePeriodBt(5)}
              >
                3개월
              </SmallButton>
              <SmallButton
                style={{ marginRight: "5px", minWidth: "40px" }}
                onClick={() => handlePeriodBt(6)}
              >
                전체
              </SmallButton>
            </div>
          </BigKeyword>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            marginBottom: "20px",
          }}
        >
          <SearchButton onClick={handleClickSearch}>검색</SearchButton>
          <SearchButton style={{ background: " #f44336" }}>초기화</SearchButton>
        </div>
      </Wrap>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>
          <SmallButton style={{ marginRight: "5px" }}>
            전체메일 발송
          </SmallButton>
          <SmallButton>엑셀 저장</SmallButton>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default DpstHeader;
