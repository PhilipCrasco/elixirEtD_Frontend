import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Table,
  Tag,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
} from "@ajna/pagination";
import PageScrollImport from "../../components/PageScrollImport";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { BiRightArrow } from "react-icons/bi";
import { FaArrowAltCircleRight, FaShippingFast, FaSort } from "react-icons/fa";
import moment from "moment";
import { CancelApprovedDate, CancelConfirmation } from "./ActionModal";
import PageScroll from "../../utils/PageScroll";
import { GoArrowSmallRight } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { Search2Icon } from "@chakra-ui/icons";

export const ListofApprovedDate = ({
  customerName,
  setCustomerName,
  customerList,
  moveData,
  pagesCount,
  currentPage,
  fetchApprovedMoveOrders,
  lengthIndicator,
  setCurrentPage,
  setItemCode,
  setWarehouseId,
  setHighlighterId,
  setOrderId,
  orderId,
  setDeliveryStatus,
  setBatchNumber,
  buttonChanger,
  preparedLength,
  orderListData,
  status,
  setStatus,
  setSearch,
  pages,
  setPageSize,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    setItemCode("");
    setWarehouseId("");
    setHighlighterId("");
    setOrderId("");
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const handleId = (data) => {
    setItemCode("");
    setHighlighterId("");
    // setDeliveryStatus("");
    if (data) {
      setOrderId(data);
    } else {
      setOrderId("");
    }
    console.log(orderId);
    console.log(orderListData);
  };

  // Return to Page 1 once length === 0
  useEffect(() => {
    if (lengthIndicator === 0) {
      // setCurrentPage(1);
      fetchApprovedMoveOrders();
    }
  }, [lengthIndicator]);

  //Auto select index 0
  useEffect(() => {
    setOrderId(moveData?.orders?.id);
  }, [moveData]);

  //Sort by date start line
  const [order, setOrder] = useState("asc");
  function descendingComparator(a, b) {
    if (
      moment(b?.preparedDate).format("yyyy-MM-DD") <
      moment(a?.preparedDate).format("yyyy-MM-DD")
    ) {
      return -1;
    }
    if (
      moment(b?.preparedDate).format("yyyy-MM-DD") >
      moment(a?.preparedDate).format("yyyy-MM-DD")
    ) {
      return 1;
    }
    return 0;
  }
  function getComparator(order) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b)
      : (a, b) => -descendingComparator(a, b);
  }
  //Sort by date end line

  const {
    isOpen: isCancel,
    onOpen: openCancel,
    onClose: closeCancel,
  } = useDisclosure();
  const cancelHandler = (id) => {
    if (id) {
      setOrderId(id);
      openCancel();
    }
  };

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    console.log(inputValue);
  };

  const selectedValue = () => {
    const option = [{ name: "Pick-Up" }];
    const selectedId = 0;
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    // setSelectedMIRIds([]); // Reset selected MIR IDs when changing status
  };

  const handleCustomerButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleCustomerNameClick = (name) => {
    setCustomerName(name);
    setIsDrawerOpen(false);
    // setIsAllChecked(false);
    // setSelectedMIRIds([]);
    // setDisableScheduleButton(true);
  };

  return (
    <Flex w="full" flexDirection="column">
      <Flex w="full" direction="row" justifyContent="space-between">
        <HStack spacing={0}>
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={!status ? "blue" : "gray"}
            variant={!status ? "solid" : "outline"}
            onClick={() => handleStatusChange(false)}
          >
            Regular Orders
            {/* {regularOrdersCount > 0 && (
            // <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
            //   {regularOrdersCount}
            // </Badge>
          )} */}
          </Button>
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={status ? "blue" : "gray"}
            variant={status ? "solid" : "outline"}
            onClick={() => handleStatusChange(true)}
          >
            Rush Orders
            {/* {rushOrdersCount > 0 && (
            <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
              {rushOrdersCount}
            </Badge>
          )} */}
          </Button>
        </HStack>
        <HStack flexDirection="row">
          <InputGroup size="sm">
            <InputLeftElement
              pointerEvents="none"
              children={<FiSearch bg="black" fontSize="18px" />}
            />
            <Input
              fontSize="13px"
              type="text"
              border="1px"
              // bg="#E9EBEC"
              borderRadius="none"
              placeholder="Search"
              // borderColor="gray.400"
              // _hover={{ borderColor: "gray.400" }}
              onChange={(e) => searchHandler(e.target.value)}
            />
          </InputGroup>
        </HStack>
        {/* <HStack w="40%">
          <Badge bgColor="secondary" fontSize="10px" color="white" px={1}>
            Customer:{" "}
          </Badge>
          <Text fontSize="13px">{customerName && customerName}</Text>
        </HStack>

        <Flex>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                border="1px"
                fontSize="xs"
                px={2}
                _hover={{ bg: "blue.200", color: "white" }}
                borderRadius="none"
                size="sm"
              >
                {"< Previous"}
              </PaginationPrevious>
              <Text mx={1} bgColor="primary" color="white" px={2} pt={1}>
                {currentPage}
              </Text>
              <PaginationNext
                border="1px"
                fontSize="xs"
                px={4}
                _hover={{ bg: "blue.200", color: "white" }}
                borderRadius="none"
                size="sm"
              >
                {"Next >"}
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Flex> */}
      </Flex>

      {/* {buttonChanger ? (
        <VStack spacing={1}>
          <HStack w="full" justifyContent="start">
            <Badge bgColor="primary" fontSize="10px" color="white" px={1}>
              Delivery Status:{" "}
            </Badge>
            <Select
              onChange={(e) => setDeliveryStatus(e.target.value)}
              placeholder=" "
              w="15%"
              size="xs"
              bgColor="#fff8dc"
            >
              <option>Pick-Up</option>
            </Select>
          </HStack>
          <HStack w="full" justifyContent="start">
            <Badge bgColor="primary" fontSize="10px" color="white" px={1}>
              Batch Number:{" "}
            </Badge>
            <Select
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder=" "
              w="15%"
              size="xs"
              bgColor="#fff8dc"
            >
              <option>{`${moment(new Date()).format("YYYY")} - 1`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 2`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 3`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 4`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 5`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 6`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 7`}</option>
            </Select>
          </HStack>
        </VStack>
      ) : (
        ""
      )} */}
      <VStack w="full" spacing={0} justifyContent="center">
        <Box w="full" bgColor="primary" h="22px">
          <Text
            fontWeight="semibold"
            color="white"
            textAlign="center"
            justifyContent="center"
            fontSize="xs"
          >
            List of Approved Orders
          </Text>
        </Box>
        <PageScroll minHeight="150px" maxHeight="210px">
          <Table size="xs" variant="simple">
            <Thead bgColor="secondary" position="sticky" top={0} zIndex={1}>
              <Tr p={3}>
                <Th color="white" fontSize="10px">
                  Line
                </Th>
                <Th color="white" fontSize="10px">
                  MIR ID
                </Th>
                {/* <Th color="white" fontSize="10px">
                  Department
                </Th> */}
                <Th color="white" fontSize="10px">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px">
                  Customer Name
                </Th>
                {/* <Th color="white" fontSize="10px">
                  Category
                </Th> */}
                <Th color="white" fontSize="10px">
                  Total Quantity Order
                </Th>
                <Th color="white" fontSize="10px">
                  <HStack>
                    <Text>Prepared Date</Text>
                    <Button
                      cursor="pointer"
                      onClick={() => {
                        setOrder(order === "asc" ? "desc" : "asc");
                      }}
                      size="xs"
                      p={0}
                      m={0}
                      background="none"
                      _hover={{ background: "none" }}
                    >
                      <FaSort />
                    </Button>
                  </HStack>
                </Th>
                {/* <Th color="white" fontSize="10px">
                  Rush
                </Th> */}
                <Th color="white" fontSize="10px">
                  Cancel
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {moveData?.orders?.sort(getComparator(order)).map((order, i) => (
                <Tr
                  key={i}
                  title={order.isReject ? order.remarks : ""}
                  onClick={() => handleId(order.id)}
                  bgColor={orderId === order.id ? "blue.100" : "none"}
                  _hover={
                    order.isReject
                      ? { bgColor: "gray.200" }
                      : { bgColor: "none" }
                  }
                  cursor="pointer"
                >
                  {orderId === order.id ? (
                    <Td>
                      <GoArrowSmallRight fontSize="27px" />
                    </Td>
                  ) : (
                    <Td fontSize="11px">{i + 1}</Td>
                  )}
                  <Td fontSize="xs">{order.id}</Td>
                  {/* <Td fontSize="xs">{order.department}</Td> */}
                  <Td fontSize="xs">{order.customerCode}</Td>
                  <Td fontSize="xs">{order.customerName}</Td>

                  {/* <Td fontSize="xs">{order.category}</Td> */}
                  <Td fontSize="xs">{order.totalOrders}</Td>
                  <Td fontSize="xs">
                    {moment(order.preparedDate).format("MM/DD/yyyy")}
                  </Td>

                  {/* <Td fontSize="xs">
                    {order.rush ? (
                      <FaShippingFast
                        title="Rush Orders"
                        fontSize="17px"
                        color="orange"
                      />
                    ) : (
                      <FaShippingFast fontSize="17px" color="#A0AEC0" />
                    )}
                  </Td> */}
                  <Td fontSize="11px">
                    <Button
                      size="xs"
                      fontSize="11px"
                      colorScheme="red"
                      onClick={() => cancelHandler(order.id)}
                      disabled={preparedLength > 0}
                      title={
                        preparedLength > 0
                          ? "Please cancel all prepared items first"
                          : ""
                      }
                      borderRadius="none"
                    >
                      Cancel
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </VStack>
      <Flex justifyContent="right" mt={1}>
        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                borderRadius="none"
                bg="primary"
                color="white"
                p={1}
                _hover={{ bg: "btnColor", color: "white" }}
                size="xs"
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    borderRadius="none"
                    _hover={{ bg: "btnColor", color: "white" }}
                    _focus={{ bg: "btnColor" }}
                    p={3}
                    bg="primary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                    size="xs"
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext
                  borderRadius="none"
                  bg="primary"
                  color="white"
                  p={1}
                  _hover={{ bg: "btnColor", color: "white" }}
                  size="xs"
                  mb={2}
                >
                  {">>"}
                </PaginationNext>
                <Select
                  borderRadius="none"
                  onChange={handlePageSizeChange}
                  bg="#FFFFFF"
                  // size="xs"
                  mb={2}
                  variant="outline"
                  size="xs"
                >
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>
      </Flex>

      {isCancel && (
        <CancelApprovedDate
          isOpen={isCancel}
          onClose={closeCancel}
          id={orderId}
          setOrderId={setOrderId}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
        />
      )}
    </Flex>
  );
};
