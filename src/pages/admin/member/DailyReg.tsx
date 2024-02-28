import { Bar } from "@nivo/bar";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  BigKeyword,
  Common,
  MainTitle,
  SearchButton,
  SelectStyle,
  SubTitle,
} from "../../../styles/AdminBasic";
import { getRegister } from "../../../api/member/memberApi";

export interface RegisterChartData {
  date: string;
  registerCnt: number;
  registerRate: string;
  totalRegisterCnt: number;
}

export interface ResRegister {
  code: string;
  message: string;
  data: RegisterChartData[];
}

const columns = [
  {
    title: "날짜",
    dataIndex: "date",
    key: "date",
    width: "10%",
    render: (date: string) => date.substring(5),
  },
  {
    title: "그래프",
    key: "chart",
    width: "50%",
    render: (text: any, record: RegisterChartData) => (
      <div style={{ width: "100%" }}>
        <Bar
          width={Math.floor(parseFloat(record.registerRate) * 500)}
          height={10}
          data={[
            {
              id: record.date,
              value: Math.floor(parseFloat(record.registerRate) * 100),
            },
          ]}
          keys={["value"]}
          indexBy="id"
          padding={0.3}
          colors={{ scheme: "nivo" }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          enableGridX={false}
          enableGridY={false}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          animate={true}
          layout="horizontal"
        />
      </div>
    ),
  },
  {
    title: "비율",
    dataIndex: "registerRate",
    key: "registerRate",
    width: "20%",

    render: (registerRate: string) => {
      const parsedRate = parseFloat(registerRate);
      return isNaN(parsedRate) ? "0%" : (parsedRate * 100).toFixed(2) + "%";
    },
  },
  {
    title: "전체",
    dataIndex: "totalRegisterCnt",
    key: "totalRegisterCnt",
    width: "20%",
  },
];

const DailyReg: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [yearData, setYearData] = useState<number>();
  const [resMonth, setResMonth] = useState<ResRegister | null>(null);

  // 년도 변경 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value));
  };

  // 월 변경 핸들러
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(Number(e.target.value));
  };

  const onSearchYear = () => {
    setYearData(year); // 검색 버튼을 클릭할 때만 yearData를 설정합니다.
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const successFn = (data: ResRegister) => {
        setResMonth(data);
        // console.log("데이터:", resMonth);
      };
      const failFn = (error: string) => {
        console.error("목록 호출 오류:", error);
      };
      const errorFn = (error: string) => {
        console.error("목록 호출 서버 에러:", error);
      };
      await getRegister(year, month, successFn, failFn, errorFn);
    } catch (error) {
      console.error("에러:", error);
    }
  };

  return (
    <>
      <MainTitle>일별 가입통계분석</MainTitle>
      <SubTitle>통계분석</SubTitle>
      <BigKeyword
        style={{
          borderTop: `1px solid ${Common.color.primary}`,
          marginBottom: "40px",
        }}
      >
        <div className="left">기간검색</div>
        <div className="right">
          <SelectStyle value={year} onChange={handleYearChange}>
            {Array.from({ length: 3 }, (_, i) => (
              <option key={currentYear - i} value={currentYear - i}>
                {currentYear - i}년
              </option>
            ))}
          </SelectStyle>
          {/* 월 선택 */}
          <SelectStyle value={month} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}월
              </option>
            ))}
          </SelectStyle>
          <SearchButton onClick={onSearchYear}>검색</SearchButton>
        </div>
      </BigKeyword>
      {resMonth && (
        <Table<RegisterChartData>
          dataSource={resMonth.data}
          columns={columns}
          pagination={false}
        />
      )}
    </>
  );
};

export default DailyReg;
