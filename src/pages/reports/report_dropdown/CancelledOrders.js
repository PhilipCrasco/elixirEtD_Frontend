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

const fetchCancelledOrdersApi = async (dateFrom, dateTo) => {
  const toAdd = new Date(dateTo);
  const plus1 = toAdd?.setDate(toAdd?.getDate() + 1);
  const formmattedDateFrom = moment(dateFrom).format("DD/MM/yyyy");
  const formmattedDateTo = moment(plus1).format("yyyy-MM-DD");
  const res = await request.get(
    `Reports/CancelledOrderedReports?dateFrom=${dateFrom}&dateTo=${formmattedDateTo}`
  );
  return res.data;
};

export const CancelledOrders = ({ dateFrom, dateTo, sample, setSheetData }) => {
  const [buttonChanger, setButtonChanger] = useState(true);

  const [cancelledData, setCancelledData] = useState([]);

  const fetchCancelledOrders = () => {
    fetchCancelledOrdersApi(dateFrom, dateTo).then((res) => {
      setCancelledData(res);
      setSheetData(
        res?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Order ID": item.orderId,
            "Date Ordered": item.dateOrdered,
            "Date Needed": item.dateNeeded,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            "Quantity Ordered": item.quantityOrdered,
            Reason: item.reason,
            "Cancelled Date": moment(item.cancelledDate).format("yyyy-MM-DD"),
            "Cancelled By": item.cancelledBy,
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchCancelledOrders();

    return () => {
      setCancelledData([]);
    };
  }, [dateFrom, dateTo]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex border="1px">
        <PageScroll minHeight="600px" maxHeight="620px">
          <Table size="sm">
            <Thead bgColor="primary" h="40px">
              <Tr>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Order ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Date Ordered
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Date Needed
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Name
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Item Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Item Description
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Quantity Ordered
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Reason
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Cancelled Date
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Cancelled By
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {cancelledData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.orderId}</Td>
                  <Td fontSize="xs">{item.dateOrdered}</Td>
                  <Td fontSize="xs">{item.dateNeeded}</Td>
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  <Td fontSize="xs">{item.itemCode}</Td>
                  <Td fontSize="xs">{item.itemDescription}</Td>
                  <Td fontSize="xs">{item.quantityOrdered}</Td>
                  <Td fontSize="xs">{item.reason}</Td>
                  <Td fontSize="xs">
                    {moment(item.cancelledDate).format("yyyy-MM-DD")}
                  </Td>
                  <Td fontSize="xs">{item.cancelledBy}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      {/* <Flex justifyContent='end' mt={2}>
          <Button size='xs' colorScheme='teal' onClick={() => setButtonChanger(!buttonChanger)}>
              {buttonChanger ? `>>>>` : `<<<<`}
          </Button>
      </Flex> */}
    </Flex>
  );
};
