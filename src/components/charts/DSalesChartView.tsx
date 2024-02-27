import React, { useEffect, useState } from "react";
import SalesChart from "./SalesChart";
import { ConfigProvider, Radio } from "antd";
import {
  BigCard,
  MainTitle,
  SearchButton,
  SelectStyle,
} from "../../styles/AdminBasic";
import { getChartApi } from "./MSalesChartView";
import { getSalesChart } from "../../api/chart/chartApi";

const DSalesChartView = () => {
  // 년도와 월에 대한 상태 정의
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [yearData, setYearData] = useState<number>();
  const [resMonth, setResMonth] = useState<getChartApi | null>(null);

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
    fetchData(); // fetchData 함수를 호출합니다.
    // console.log("resMonth", resMonth);
  };

  useEffect(() => {
    // console.log("resMonth", resMonth);
  }, [resMonth]);

  const fetchData = async () => {
    try {
      const successFn = (data: getChartApi) => {
        setResMonth(data);
        // console.log("데이터:", resMonth);
      };
      const failFn = (error: string) => {
        console.error("목록 호출 오류:", error);
      };
      const errorFn = (error: string) => {
        console.error("목록 호출 서버 에러:", error);
      };
      await getSalesChart(year, month, successFn, failFn, errorFn);
    } catch (error) {
      console.error("에러:", error);
    }
  };
  return (
    <div>
      <MainTitle>일별 매출통계</MainTitle>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* 년도 선택 */}
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

      <ConfigProvider
        theme={{
          components: {
            Radio: {
              colorText: "#d9d9d9",
              colorPrimary: "#7f7f7f",
              colorLink: "#7f7f7f",
              colorLinkActive: "#7f7f7f",
              colorPrimaryActive: "#7f7f7f",
              colorPrimaryBorder: "#7f7f7f",
              colorPrimaryHover: "#7f7f7f",

              /* here is your component tokens */
            },
            Table: {
              headerBg: "#535353",
              headerColor: "#fff",
            },
          },
        }}
      ></ConfigProvider>
      <BigCard style={{ marginTop: "15px" }}>
        <SalesChart yearData={yearData} monthData={month} resMonth={resMonth} />
      </BigCard>
    </div>
  );
};

export default DSalesChartView;
