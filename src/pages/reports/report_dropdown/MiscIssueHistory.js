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

const fetchMiscellaneousIssueHistoryApi = async (dateFrom, dateTo) => {
  const dayaDate = new Date();
  const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1);
  const res = await request.get(
    `Reports/MiscellaneousIssueReport?dateFrom=${dateFrom}&dateTo=${moment(
      dateToDaya
    ).format("yyyy-MM-DD")}`
  );
  return res.data;
};

export const MiscIssueHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [miscIssueData, setMiscIssueData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchMiscellaneousIssueHistory = () => {
    fetchMiscellaneousIssueHistoryApi(dateFrom, dateTo, sample).then((res) => {
      setMiscIssueData(res);
      setSheetData(
        res?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Issue ID": item.orderId,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            Details: item.details,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            Quantity: item.quantity,
            // 'Expiration Date': item.expirationDate,
            "Transacted By": item.transactBy,
            "Transaction Date": moment(item.transactDate).format("yyyy-MM-DD"),
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchMiscellaneousIssueHistory();

    return () => {
      setMiscIssueData([]);
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
                  Issue ID
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
                      Details
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      UOM
                    </Th>
                    {/* <Th color='white'>category</Th>  */}
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transact By
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transaction Date
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
                      Department Code
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
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {miscIssueData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.issueId}</Td>
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.details}</Td>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      {/* <Td>Body</Td> */}
                      <Td fontSize="xs">{item.quantity}</Td>
                      <Td fontSize="xs">{item.transactBy}</Td>
                      <Td fontSize="xs">
                        {moment(item.transactDate).format("yyyy-MM-DD")}
                      </Td>
                    </>
                  ) : (
                    <>
                      {/* <Td>{item.expirationDate}</Td> */}
                      <Td fontSize="xs">{item.companyCode}</Td>
                      <Td fontSize="xs">{item.companyName}</Td>
                      <Td fontSize="xs">{item.departmentCode}</Td>
                      <Td fontSize="xs">{item.departmentName}</Td>
                      <Td fontSize="xs">{item.locationCode}</Td>
                      <Td fontSize="xs">{item.locationName}</Td>
                      <Td fontSize="xs">{item.accountTitles}</Td>
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
