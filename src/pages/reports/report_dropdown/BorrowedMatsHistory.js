import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";

const fetchBorrowedHistoryApi = async (dateFrom, dateTo) => {
  const res = await request.get(
    `Reports/BorrowedReturnedReports?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
  return res.data;
};

export const BorrowedMatsHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [borrowedData, setBorrowedData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchBorrowedHistory = () => {
    fetchBorrowedHistoryApi(dateFrom, dateTo, sample).then((res) => {
      setBorrowedData(res);
      setSheetData(
        res?.map((item, i) => {
          return {
            "Line Number": i + 1,
            ID: item.borrowedId,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescrption,
            UOM: item.uom,
            "Borrowed Qty": item.borrowedQuantity,
            "Borrowed Date": item.borrowedDate,
            Consumed: item.consumed,
            "Returned Qty": item.returnedQuantity,
            "Returned Date": item.returnedDate,
            "Company Code": item.companyCode,
            "Company Name": item.companyName,
            "Department Code": item.departmentCode,
            "Department Name": item.departmentName,
            "Location Code": item.locationCode,
            "Location Name": item.locationName,
            "Account Title": item.accountTitles,
            Status: item.statusApprove,
            "Transaction By": item.transactedBy,
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchBorrowedHistory();

    return () => {
      setBorrowedData([]);
    };
  }, [dateFrom, dateTo, sample]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex border="1px" borderColor="gray.400">
        <PageScroll minHeight="600px" maxHeight="620px">
          <Table size="sm" variant="striped">
            <Thead bgColor="primary" h="40px">
              <Tr>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Borrowed ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Name
                </Th>
                {buttonChanger ? (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      UOM
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Borrowed Date
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Consumed
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Returned Qty
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Returned Date
                    </Th>
                  </>
                ) : (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Company Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Company Name
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Deparment Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Department Name
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Location Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Location Name
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Account Title
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Status
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transacted By
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {borrowedData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.borrowedId}</Td>
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      <Td fontSize="xs">
                        {item.borrowedQuantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.borrowedDate !== null
                          ? moment(item.borrowedDate).format("MM/DD/yyyy")
                          : "Pending Borrowed"}
                      </Td>
                      <Td fontSize="xs">
                        {item.consumed.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.returnedQuantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {item.returnedDate !== null
                          ? moment(item.returnedDate).format("MM/DD/yyyy")
                          : "Pending Return"}
                      </Td>
                    </>
                  ) : (
                    <>
                      <Td fontSize="xs">{item.companyCode}</Td>
                      <Td fontSize="xs">{item.companyName}</Td>
                      <Td fontSize="xs">{item.departmentCode}</Td>
                      <Td fontSize="xs">{item.departmentName}</Td>
                      <Td fontSize="xs">{item.locationCode}</Td>
                      <Td fontSize="xs">{item.locationName}</Td>
                      <Td fontSize="xs">{item.accountTitles}</Td>
                      <Td fontSize="xs">{item.statusApprove}</Td>
                      <Td fontSize="xs">{item.transactedBy}</Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="end" mt={2}>
        <Button
          size="xs"
          colorScheme="blue"
          onClick={() => setButtonChanger(!buttonChanger)}
        >
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
