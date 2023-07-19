import React, { useEffect } from "react";
import {
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import PageScroll from "../../utils/PageScroll";
import { CancelConfirmation } from "./ActionModal";
// import { CancelConfirmation } from './Action-Modal'

export const ListOfBorrowed = ({
  borrowedData,
  selectorId,
  setSelectorId,
  setTotalQuantity,
  fetchActiveBorrowed,
  fetchBarcodeNo,
  remarks,
}) => {
  const TableHead = [
    "Line",
    "ID",
    "Item Code",
    "Item Description",
    "UOM",
    "Quantity",
    "Cancel",
  ];

  const {
    isOpen: isCancel,
    onClose: closeCancel,
    onOpen: openCancel,
  } = useDisclosure();
  const cancelHandler = (id) => {
    if (id) {
      setSelectorId(id);
      openCancel();
    } else {
      setSelectorId("");
    }
  };

  useEffect(() => {
    if (borrowedData.length) {
      let sumQuantity = borrowedData.map((q) => parseFloat(q.totalQuantity));
      let sum = sumQuantity.reduce((a, b) => a + b);
      setTotalQuantity(sum);
    }
  }, [borrowedData]);

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
      <VStack justifyContent="center" w="full" spacing={-1}>
        <Text
          bgColor="secondary"
          fontSize="xs"
          w="full"
          color="white"
          textAlign="center"
          fontWeight="semibold"
          py={1}
        >
          List of Borrowed Materials
        </Text>
        <Flex justifyContent="center" w="full">
          <PageScroll minHeight="260px" maxHeight="300px">
            <Table size="sm">
              <Thead bgColor="secondary">
                <Tr>
                  {TableHead?.map((item, i) => (
                    <Th color="white" fontSize="11px" key={i}>
                      {item}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {borrowedData?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{i + 1}</Td>
                    <Td fontSize="xs">{item?.id}</Td>
                    <Td fontSize="xs">{item?.itemCode}</Td>
                    <Td fontSize="xs">{item?.itemDescription}</Td>
                    <Td fontSize="xs">{item?.uom}</Td>
                    <Td fontSize="xs">{item?.totalQuantity}</Td>
                    <Td fontSize="xs">
                      <Button
                        onClick={() => cancelHandler(item.id)}
                        colorScheme="red"
                        size="xs"
                      >
                        Cancel
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </PageScroll>
        </Flex>
      </VStack>

      {isCancel && (
        <CancelConfirmation
          isOpen={isCancel}
          onClose={closeCancel}
          selectorId={selectorId}
          setSelectorId={setSelectorId}
          fetchActiveBorrowed={fetchActiveBorrowed}
          fetchBarcodeNo={fetchBarcodeNo}
        />
      )}
    </Flex>
  );
};
