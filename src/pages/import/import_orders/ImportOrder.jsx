import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BiImport } from "react-icons/bi";
import { MdOutlineError } from "react-icons/md";
import * as XLSX from "xlsx";
import DateConverter from "../../../components/DateConverter";
import moment from "moment";
import request from "../../../services/ApiClient";
import PageScrollImport from "../../../components/PageScrollImport";
import { ToastComponent } from "../../../components/Toast";
import ErrorList from "../ErrorList";
import OrdersConfirmation from "../../ordering/orders/OrdersConfirmation";
import { json } from "react-router-dom";
import Swal from "sweetalert2";

const ImportOrder = () => {
  const [workbook, setWorkbook] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [sheetOptions, setSheetOptions] = useState([]);
  const toast = useToast();

  const fileClear = useRef();

  const [errorData, setErrorData] = useState([]);
  const {
    isOpen: isError,
    onOpen: openError,
    onClose: closeError,
  } = useDisclosure();

  const fileRenderer = (jsonData) => {
    jsonData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_");
        if (key !== newKey) {
          row[newKey] = row[key];
          delete row[key];
        }
      });
    });
    setExcelData(jsonData);
    console.log(jsonData);
  };

  const fileHandler = async (e) => {
    const file = e[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.readFile(data);

    setWorkbook(workbook);
    setSheetOptions(workbook.SheetNames);

    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet);

    fileRenderer(jsonData);
    if (e) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  //   const sheetNumberHandler = (data = 0) => {
  //     const worksheet = workbook.Sheets[workbook.SheetNames[data]];
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //     fileRenderer(jsonData);
  //     if (data) {
  //       setIsDisabled(false);
  //     }
  //   };

  const resultArray = excelData.map((item) => {
    let newOrderDate = DateConverter(item.order_date);
    let newDateNeeded = DateConverter(item.date_needed);

    return {
      trasactId: item?.transaction_id,
      customercode: item?.customer_code,
      customerName: item?.customer_name,
      customerType: item?.customer_type,
      department: item?.department,
      orderNo: item?.order_no,
      orderDate: moment(newOrderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(newDateNeeded).format("yyyy-MM-DD"),
      itemCode: item?.item_code,
      itemdDescription: item?.item_description,
      uom: item?.uom,
      quantityOrdered: item?.quantity_ordered,
      category: item?.category,
    };
  });

  // console.log(resultArray);

  const submitFile = (resultArray) => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync these orders?",
      icon: "info",
      color: "black",
      background: "#white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (resultArray.length > 0) {
          try {
            setIsLoading(true);
            const res = request
              .post(
                `Ordering/AddNewOrders`,
                resultArray.map((item) => ({
                  trasactId: item?.trasactId,
                  department: item?.department,
                  customercode: item?.customercode,
                  customerName: item?.customerName,
                  customerType: item?.customerType,
                  orderNo: item?.orderNo,
                  orderDate: moment(item?.orderDate).format("yyyy-MM-DD"),
                  dateNeeded: moment(item?.dateNeeded).format("yyyy-MM-DD"),
                  itemCode: item?.itemCode,
                  itemdDescription: item?.itemdDescription,
                  uom: item?.uom,
                  quantityOrdered: item?.quantityOrdered,
                  category: item?.category,
                }))
              )
              .then((res) => {
                ToastComponent("Success", "Orders Imported!", "success", toast);
                setIsLoading(false);
                fileClear.current.value = "";
                setExcelData([]);
              })
              .catch((err) => {
                setIsLoading(false);
                setErrorData(err.response.data);
                if (err.response.data) {
                  openError();
                }
              });
          } catch (error) {}
        } else {
          ToastComponent(
            "Error!",
            "No data provided, please check your import",
            "error",
            toast
          );
        }
      }
    });

    // console.log(errorData);
  };

  return (
    <Flex bg="form" w="full" boxShadow="md" flexDirection="column">
      <Flex justifyContent="space-between">
        <Box />
        <Box p={2}>
          <Button
            type="submit"
            leftIcon={<BiImport fontSize="19px" />}
            colorScheme="blue"
            borderRadius="none"
            fontSize="12px"
            size="xs"
            isLoading={isLoading}
            isDisabled={isDisabled}
            onClick={() => submitFile(resultArray)}
          >
            Import Order
          </Button>
        </Box>
      </Flex>
      <Flex
        w="100%"
        h="full"
        p={2}
        mt={-4}
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex w="full" h="full">
          <PageScrollImport maxHeight="470px">
            <Table variant="striped" size="sm">
              <Thead bg="primary" position="sticky" zIndex="0" top={0}>
                <Tr>
                  <Th h="40px" color="white" fontSize="10px">
                    Transaction Id
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Order Date
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Date Needed
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Department
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Customer Code
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Customer Name
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Customer Type
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Category
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Item Code
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Item Description
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    UOM
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Quantity Ordered
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((ed, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">
                      {ed.trasactId ? (
                        ed.trasactId
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.orderDate ? (
                        ed.orderDate
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.dateNeeded ? (
                        ed.dateNeeded
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.department ? (
                        ed.department
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.customercode ? (
                        ed.customercode
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.customerName ? (
                        ed.customerName
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.customerType ? (
                        ed.customerType
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.category ? (
                        ed.category
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.itemCode ? (
                        ed.itemCode
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.itemdDescription ? (
                        ed.itemdDescription
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.uom ? (
                        ed.uom
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="xs">
                      {ed.quantityOrdered ? (
                        ed.quantityOrdered.toLocaleString(undefined, {
                          maximumFractionDigit: 2,
                        })
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          Import Order is uploaded.
                        </Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </PageScrollImport>
        </Flex>

        <Flex p={2} bg="primary" w="100%">
          <Input
            ref={fileClear}
            color="white"
            type="file"
            w="25%"
            size="25px"
            fontSize="13px"
            onChange={(e) => fileHandler(e.target.files)}
          />
        </Flex>
      </Flex>
      {isError && (
        <OrdersConfirmation
          isOpen={isError}
          onClose={closeError}
          errorData={errorData}
        />
      )}
    </Flex>
  );
};

export default ImportOrder;
