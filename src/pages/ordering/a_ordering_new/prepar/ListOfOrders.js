import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import { FiEdit } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";
import {
  CancelModalConfirmation,
  EditModal,
  ScheduleModal,
} from "./ActionModal";

export const ListOfOrders = ({
  fetchMirList,
  selectedMIRIds,
  setSelectedMIRIds,
  setCustomerName,
  isAllChecked,
  setIsAllChecked,
  disableScheduleButton,
  setDisableScheduleButton,
  checkedItems,
  setCheckedItems,
  setCurrentPage,
  setSearch,
}) => {
  const [orderList, setOrderList] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const [editData, setEditData] = useState({
    mirId: "",
    id: "",
    itemCode: "",
    itemDescription: "",
    uom: "",
    quantiyOrdered: "",
    standardQuantity: "",
  });
  const [cancelId, setCancelId] = useState("");

  // const [isCheckboxChecked, setIsCheckboxChecked] = useState(true);

  const {
    isOpen: isEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  const {
    isOpen: isCancel,
    onOpen: openCancel,
    onClose: closeCancel,
  } = useDisclosure();

  const {
    isOpen: isSchedule,
    onOpen: openSchedule,
    onClose: closeSchedule,
  } = useDisclosure();

  const fetchOrderList = async () => {
    try {
      const response = await request.get(
        `Ordering/GetAllListOfMirOrdersByMirIds?listofMirIds=${selectedMIRIds.join(
          "&listofMirIds="
        )}`
      );
      setOrderList(response.data);

      // Check if any order has a negative value for "Reserve"
      const hasNegativeReserve = response.data.some(
        (order) => order.stockOnHand < 0
      );
      setDisableScheduleButton(hasNegativeReserve);
    } catch (error) {
      console.error("Error fetching order list:", error);
    }
  };

  useEffect(() => {
    // Fetch orders based on customer name and selected MIR IDs
    // fetchOrderList();

    if (selectedMIRIds.length > 0) {
      fetchOrderList();
    } else {
      setOrderList([]); // Reset order list if customer name or selected MIR IDs are empty
    }
  }, [selectedMIRIds]);

  const editHandler = ({
    mirId,
    id,
    itemCode,
    itemDescription,
    uom,
    quantityOrder,
    standardQuantity,
    // stockOnHand,
  }) => {
    if (
      mirId &&
      id &&
      itemCode &&
      itemDescription &&
      uom &&
      standardQuantity
      // stockOnHand
    ) {
      setEditData({
        mirId: mirId,
        id: id,
        itemCode: itemCode,
        itemDescription: itemDescription,
        uom: uom,
        quantity: quantityOrder,
        standardQuantity: standardQuantity,
        // stockOnHand: stockOnHand,
      });
      openEdit();
      console.log(editData);
    } else {
      setEditData({
        id: "",
        itemCode: "",
        itemDescription: "",
        uom: "",
        quantiy: "",
        standardQuantity: "",
        // stockOnHand: "",
      });
    }
  };

  const cancelHandler = ({ id }) => {
    if (id) {
      setCancelId(id);
      console.log(cancelId);
      openCancel();
    } else {
      setCancelId("");
    }
  };

  const scheduleHandler = () => {
    openSchedule();
  };

  return (
    <Flex direction="column" p={4} w="full">
      <Text
        textAlign="center"
        bgColor="secondary"
        color="white"
        fontSize="13px"
      >
        List of Orders
      </Text>
      <PageScroll minHeight="260px" maxHeight="270px">
        <Table size="sm" variant="simple">
          <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th color="white" fontSize="10px">
                MIR ID
              </Th>
              <Th color="white" fontSize="10px">
                Customer Name
              </Th>
              <Th color="white" fontSize="10px">
                Item Code
              </Th>
              <Th color="white" fontSize="10px">
                Item Description
              </Th>
              <Th color="white" fontSize="10px">
                UOM
              </Th>
              <Th color="white" fontSize="10px">
                Quantity Order
              </Th>
              <Th color="white" fontSize="10px">
                Reserve
              </Th>
              <Th color="white" fontSize="10px" pr={4}>
                Action
              </Th>
              {/* Add more table headers as needed */}
            </Tr>
          </Thead>
          <Tbody>
            {orderList.map((order, i) => (
              <Tr key={i}>
                <Td fontSize="xs">{order.mirId}</Td>
                <Td fontSize="xs">{order.customerName}</Td>
                <Td fontSize="xs">{order.itemCode}</Td>
                <Td fontSize="xs">{order.itemDescription}</Td>
                <Td fontSize="xs">{order.uom}</Td>
                <Td fontSize="xs">{order.quantityOrder}</Td>
                <Td fontSize="xs">{order.stockOnHand}</Td>
                <Td fontSize="xs" p={0}>
                  <HStack spacing={0}>
                    <Button
                      onClick={() => editHandler(order)}
                      disabled={order.stockOnHand === 0}
                      // colorScheme="blue"
                      size="xs"
                      title="Edit"
                      bg="none"
                      px={4}
                    >
                      {/* <Text fontSize="xs">Edit</Text> */}
                      <FiEdit fontSize="15px" />
                    </Button>
                    <Button
                      onClick={() => cancelHandler(order)}
                      size="xs"
                      title="Cancel"
                      bg="none"
                      px={4}
                    >
                      <GiCancel fontSize="17px" />
                      {/* <Text fontSize="xs">Cancel</Text> */}
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageScroll>

      <Flex w="full" justifyContent="space-between" py={2} px={2}>
        <Text fontSize="xs">
          {/* Selected Item(s):
          {checkedItems?.length} */}
        </Text>
        <Button
          onClick={scheduleHandler}
          // title={
          //   !checkedItems?.length > 0
          //     ? disableIfStock
          //       ? "Stocks must be available"
          //       : "Please select an order to schedule"
          //     : !checkedItems?.length > 0 || disableIfStock
          //     ? "Stocks must be available"
          //     : "Schedule order(s)"
          // }
          // disabled={!checkedItems?.length > 0 || disableIfStock}
          disabled={!selectedMIRIds?.length > 0 || disableScheduleButton}
          size="sm"
          px={3}
          colorScheme="blue"
          borderRadius="none"
        >
          Schedule
        </Button>
      </Flex>

      {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          editData={editData}
          fetchOrderList={fetchOrderList}
          // fetchCustomerList={fetchCustomerList}
        />
      )}

      {isCancel && (
        <CancelModalConfirmation
          isOpen={isCancel}
          onClose={closeCancel}
          cancelId={cancelId}
          fetchOrderList={fetchOrderList}
          fetchMirList={fetchMirList}
          // fetchCustomerList={fetchCustomerList}
          setCustomerName={setCustomerName}
          //   fetchNotification={fetchNotification}
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
        />
      )}

      {isSchedule && (
        <ScheduleModal
          // checkedItems={checkedItems}
          // setCheckedItems={setCheckedItems}
          isOpen={isSchedule}
          onClose={closeSchedule}
          // customerName={customerName}
          setCustomerName={setCustomerName}
          fetchOrderList={fetchOrderList}
          fetchMirList={fetchMirList}
          // fetchCustomerList={fetchCustomerList}
          selectedMIRIds={selectedMIRIds}
          setSelectedMIRIds={setSelectedMIRIds}
          setSearch={setSearch}
          setCurrentPage={setCurrentPage}
          setIsAllChecked={setIsAllChecked}

          // setCurrentPage={setCurrentPage}
          // currentPage={currentPage}
        />
      )}
    </Flex>
  );
};

// NEWEST CODE =--------------------------------------------------------------------------------------
// import React, { useEffect } from "react";
// import {
//   Badge,
//   Flex,
//   HStack,
//   Select,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
// } from "@chakra-ui/react";
// import moment from "moment";
// import PageScroll from "../../../../utils/PageScroll";

// export const ListOfOrders = ({ mirOrderList, customers, selectedMirIds }) => {
//   const filteredOrders = mirOrderList.filter(
//     (item) => selectedMirIds[item.mirId]
//   );

//   return (
//     <Flex w="95%" h="250px" flexDirection="column">
//       <Flex flexDirection="column">
//         <Text
//           textAlign="center"
//           bgColor="secondary"
//           color="white"
//           fontSize="13px"
//         >
//           List of Orders
//         </Text>
//         <PageScroll minHeight="260px" maxHeight="270px">
//           <Table size="sm" variant="simple">
//             <Thead bgColor="secondary">
//               <Tr h="30px">
//                 <Th color="white" fontSize="10px">
//                   Line
//                 </Th>
//                 {/* <Th color="white" fontSize="10px">
//                   MIR ID
//                 </Th> */}
//                 <Th color="white" fontSize="10px">
//                   Item Code
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Item Description
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   UOM
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Reserve
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Remarks
//                 </Th>
//               </Tr>
//             </Thead>
//             {customers ? (
//               <Tbody>
//                 {mirOrderList?.map((item, i) => (
//                   <Tr key={i}>
//                     <Td fontSize="11px">{i + 1}</Td>
//                     {/* <Td fontSize="11px">{item.mirId}</Td> */}
//                     <Td fontSize="11px">{item.itemCode}</Td>
//                     <Td fontSize="11px">{item.itemDescription}</Td>
//                     <Td fontSize="11px">{item.uom}</Td>
//                     <Td fontSize="11px">{item.quantityOrder}</Td>
//                     <Td fontSize="11px">{item.stockOnHand}</Td>
//                     {/* <Td fontSize="11px">{item.orderDate}</Td> */}
//                   </Tr>
//                 ))}
//               </Tbody>
//             ) : null}
//           </Table>
//         </PageScroll>
//       </Flex>
//     </Flex>
//   );
// };
