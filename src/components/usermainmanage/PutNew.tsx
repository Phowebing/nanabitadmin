import { ConfigProvider, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  SearchProduct,
  getMdSearch,
  putMainProRc,
} from "../../api/usermain/mainProductSetApi";
import {
  BigKeyword,
  Common,
  MainTitle,
  MiddleInput,
  SearchButton,
  SelectStyle,
  SubTitle,
} from "../../styles/AdminBasic";
import { API_SERVER_HOST } from "../../util/util";
import OrderAllSelect from "../order/orderSlect/OrderAllSelect";

const CenteredHeaderTable = styled(Table)`
  &&& {
    .ant-table-thead > tr > th {
      text-align: center;
    }
    .ant-table-tbody > tr > td {
      text-align: center;
    }
  }
`;

export interface CategoryOptions {
  [key: string]: string[];
}

interface Keyword {
  keyword: string;
  iproduct: number;
}
const PutNew: React.FC = () => {
  const searchType = "searchNewProduct";
  const toggleType = "toggleNewProduct";
  const [refresh, setRefresh] = useState(0);
  const [sdata, setSdata] = useState<SearchProduct[] | undefined>();
  // 선택된 옵션과 입력 필드 값을 저장할 상태
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string | number>("");
  const [keyword, setKeyword] = useState("");
  const [iproduct, setIproduct] = useState<number>();

  // 셀렉트바 상태변경
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [sendMainCate, setSendMainCate] = useState<number>(0);
  const [sendSubCate, setSendSubCate] = useState<number>(0);

  const [messageApi, contextHolder] = message.useMessage();
  const successEvent = (txt: string) => {
    messageApi.open({
      type: "success",
      content: txt,
    });
  };
  const warningEvent = (txt: string) => {
    messageApi.open({
      type: "warning",
      content: txt,
    });
  };

  const subCategories: CategoryOptions = {
    이유식: ["임신/출산", "신생아", "베이비", "키즈"],
    유아가전: ["살균기", "기타제품"],
    놀이용품: ["유아교구", "애착인형"],
    위생용품: ["기저귀", "목욕용품", "위생용품/기타"],
    모유수유용품: ["수유용품", "모유용품"],
  };

  const handleMainCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const category = event.target.value;
    setMainCategory(event.target.value);
    setSubCategory(""); // Reset sub category on main category change
    const categoryNumbers: any = {
      이유식: 1,
      유아가전: 2,
      놀이용품: 3,
      위생용품: 4,
      모유수유용품: 5,
    };
    // console.log(categoryNumbers[category] || 0);
    setSendMainCate(categoryNumbers[category] || 0);
  };

  const handleSubCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const subCategoryValue = event.target.value;
    setSubCategory(event.target.value);
    // 서브 카테고리에 따른 숫자 출력 (선택된 서브 카테고리의 인덱스 + 1)
    const subCategoryIndex =
      subCategories[mainCategory].indexOf(subCategoryValue) + 1;
    // console.log(subCategoryIndex || 0);
    setSendSubCate(subCategoryIndex || 0);
  };

  // select 옵션 변경 시 호출될 함수
  const handleSelectChange = (optionIndex: number): void => {
    setSelectedOption(optionIndex); // 옵션 인덱스 직접 설정
    // 선택된 옵션에 따라 inputValue 초기화
    // 제품명 선택 시 (옵션 0) -> inputValue를 빈 문자열로 초기화
    // 제품코드 선택 시 (옵션 1) -> inputValue를 0으로 초기화
    setInputValue(optionIndex === 0 ? "" : 0);
  };

  // 입력 필드 값 변경 시 호출될 함수
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 선택된 옵션에 따라 입력 값 변환
    if (selectedOption === 0) {
      // 제품명인 경우
      setInputValue(event.target.value); // 문자열로 처리
      setKeyword(event.target.value);
      setIproduct(0);
    } else if (selectedOption === 1) {
      // 제품코드인 경우
      const value = parseInt(event.target.value, 10);
      setInputValue(isNaN(value) ? "" : value); // 숫자로 처리, 유효하지 않은 숫자는 빈 문자열로 처리
      setKeyword("");
      setIproduct(value);
    }
  };
  // 상품 등록하기
  const handleregist = (item: any) => {
    const putSuccessFn = () => {
      successEvent(`${item.productNm}의 상태가 변경되었습니다.`);
      setRefresh(refresh + 1);
    };
    const putFailFn = () => {
      console.log("등록 실패");
    };
    const putErrorFn = () => {
      console.log("등록 에러");
    };
    const filteredProducts: any = sdata?.filter(sdata => sdata.status === 1);

    if (filteredProducts.length >= 8) {
      // item.status가 1이면서 등록된 제품이 8개 이상인 경우에도 putMainProRc를 실행
      if (item.status === 1) {
        putMainProRc(
          toggleType,
          item.iproduct,
          putSuccessFn,
          putFailFn,
          putErrorFn,
        );
      } else {
        // 등록된 제품이 8개 이상이지만, 현재 item의 status가 1이 아닌 경우 경고만 보냄
        warningEvent(`등록된 제품이 8개 이상입니다.`);
      }
    } else {
      // 등록된 제품이 8개 미만인 경우, 정상적으로 putMainProRc 실행
      putMainProRc(
        toggleType,
        item.iproduct,
        putSuccessFn,
        putFailFn,
        putErrorFn,
      );
    }
  };

  const columns = [
    {
      title: "미리보기",
      dataIndex: "repPic",
      width: "100px",
      key: "repPic",
      render: (repPic: string) => (
        <img
          style={{ width: "66px", height: "66px", objectFit: "cover" }}
          src={repPic}
          alt=""
        />
      ),
    },
    {
      title: "상품코드",
      dataIndex: "iproduct",
      key: "iproduct",
    },
    {
      title: "상품명",
      dataIndex: "productNm",
      key: "productNm",
    },
    {
      title: "가격",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span>{price.toLocaleString()}</span>,
    },
    {
      title: "삭제",
      dataIndex: "item",
      width: "80px",
      key: "iproduct",
      render: (item: any) => (
        <>
          {item.status === 0 ? (
            <SearchButton onClick={() => handleregist(item)}>등록</SearchButton>
          ) : (
            <SearchButton
              style={{
                background: "rgb(244, 67, 54)",
              }}
              onClick={() => handleregist(item)}
            >
              해제
            </SearchButton>
          )}
        </>
      ),
    },
  ];

  const dataSource = sdata?.map(item => ({
    item: item,
    key: item.productNm,
    productNm: item.productNm,
    iproduct: item.iproduct,
    price: item.price,
    repPic: `${API_SERVER_HOST}/pic/product/${item.iproduct}/${item.repPic}`,
    status: item.iproduct,
  }));

  const fetchData = async () => {
    try {
      const successFn = (data: SearchProduct[] | undefined) => {
        setSdata(data);
      };
      const failFn = (error: string) => {
        console.error("목록 호출 오류:", error);
      };
      const errorFn = (error: string) => {
        console.error("목록 호출 서버 에러:", error);
      };
      await getMdSearch(
        successFn,
        failFn,
        errorFn,
        searchType,
        keyword,
        iproduct,
        sendMainCate,
        sendSubCate,
        0,
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSearch = async () => {
    await fetchData();
    setRefresh(refresh + 1);
  };
  const handleReset = async () => {
    setSelectedOption(1);
    setInputValue("");
    setMainCategory("");
    setSubCategory("");
    setKeyword("");
    setIproduct(0);
    setSendMainCate(0);
    setSendSubCate(0);
    await fetchData();
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    // console.log("데이터:", sdata);
    fetchData();
  }, [refresh]);

  return (
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
    >
      {contextHolder}
      <MainTitle>신상품 진열관리</MainTitle>
      <SubTitle>상품 검색</SubTitle>
      <div>
        <div style={{ marginBottom: "20px" }}>
          <BigKeyword
            style={{ borderTop: `1px solid ${Common.color.primary}` }}
          >
            <div className="left">검색어</div>
            <div className="right">
              <OrderAllSelect
                option1="제품명"
                option2="상품코드"
                onClick={handleSelectChange}
              />
              <MiddleInput
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                style={{ fontSize: "12px" }}
              />
            </div>
          </BigKeyword>
          <BigKeyword>
            <div className="left">카테고리</div>
            <div className="right">
              <SelectStyle
                style={{ fontSize: "12px", width: "100px" }}
                value={mainCategory}
                onChange={handleMainCategoryChange}
              >
                <option value="">대분류 선택</option>
                {Object.keys(subCategories).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </SelectStyle>
              <SelectStyle
                style={{ fontSize: "12px", width: "100px" }}
                value={subCategory}
                onChange={handleSubCategoryChange}
                disabled={!mainCategory}
              >
                <option value="">중분류 선택</option>
                {mainCategory &&
                  subCategories[mainCategory].map(sub => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
              </SelectStyle>
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
          <SearchButton
            style={{ fontSize: "12px", lineHeight: "12px" }}
            onClick={handleSearch}
          >
            검색
          </SearchButton>
          <SearchButton
            style={{
              background: " #f44336",
              fontSize: "12px",
              lineHeight: "12px",
            }}
            onClick={handleReset}
          >
            초기화
          </SearchButton>
        </div>
      </div>
      {/* 결과 테이블 */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#a5a5a5",
          },
          components: {
            Table: {
              headerBg: "#535353",
              headerColor: "#fff",
            },
          },
        }}
      >
        <CenteredHeaderTable
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
        />
      </ConfigProvider>
    </ConfigProvider>
  );
};
export default PutNew;
