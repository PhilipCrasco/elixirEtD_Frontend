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

const fetchMiscellaenouseReceiptApi = async (dateFrom, dateTo) => {
  // const toAdd = new Date(dateTo);
  // const plus1 = toAdd?.setDate(toAdd?.getDate() + 1);
  // const formmattedDateFrom = moment(dateFrom).format("DD/MM/yyyy");
  // const formmattedDateTo = moment(plus1).format("DD/MM/yyyy");
  const res = await request.get(
    `Reports/MiscellaneousReceiptReport?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
  return res.data;
};

export const MiscReceiptHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [miscReceiptData, setMiscReceiptData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchMiscellaenouseReceipt = () => {
    fetchMiscellaenouseReceiptApi(dateFrom, dateTo, sample).then((res) => {
      setMiscReceiptData(res);
      setSheetData(
        res?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Receipt Id": item.receiptId,
            "Supplier Code": item.supplierCode,
            "Supplier Name": item.supplierName,
            Details: item.details,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            Quantity: item.quantity,
            // 'Expiration Date': item.expirationDate,
            "Transacted By": item.trantedBy,
            "Transaction Date": moment(item.transactDate).format("yyyy-MM-DD"),
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchMiscellaenouseReceipt();

    return () => {
      setMiscReceiptData([]);
    };
  }, [dateFrom, dateTo, sample]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex border="1px">
        <PageScroll minHeight="600px" maxHeight="620px">
          <Table size="sm">
            <Thead bgColor="secondary" h="40px">
              <Tr>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Receipt ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Receipt Date
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Supplier Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Supplier Name
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
                    {/* <Th color='white'>category</Th> */}
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
                    {/* <Th color='white'>Expiration Date</Th> */}
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
              {miscReceiptData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.receiptId}</Td>
                  <Td fontSize="xs">{item.receivingDate}</Td>
                  <Td fontSize="xs">{item.supplierCode}</Td>
                  <Td fontSize="xs">{item.supplierName}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.details}</Td>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      {/* <Td>{item.category}</Td> */}
                      <Td>{item.quantity}</Td>
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
