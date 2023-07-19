import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  HStack,
  ModalOverlay,
  useDisclosure,
  Input,
  Box,
  FormLabel,
  Select,
  Stack,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
// import { EditModal } from "./ActionModalBorrowed";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { decodeUser } from "../../../../services/decode-user";

const currentUser = decodeUser();

export const ViewModal = ({
  isOpen,
  onCloseView,
  statusBody,
  fetchBorrowed,
  setIsLoading,
  issueBorrowData,
}) => {
  const {
    isOpen: isEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();

  const { isOpen: isCOA, onOpen: openCOA, onClose: closeCOA } = useDisclosure();

  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    itemCode: "",
    itemDescription: "",
    returnQuantity: "",
    consumes: "",
    quantity: "",
  });
  const [coaId, setCoaId] = useState("");

  const toast = useToast();

  const id = statusBody.id;
  const fetchBorrowedDetailsApi = async (id) => {
    const res = await request.get(
      `Borrowed/GetAllDetailsInBorrowedIssue?id=${id}`
    );
    return res.data;
  };

  const fetchBorrowedDetails = () => {
    fetchBorrowedDetailsApi(id).then((res) => {
      setBorrowedDetailsData(res);
    });
  };

  useEffect(() => {
    fetchBorrowedDetails();
  }, [id]);

  const closeHandler = () => {
    const updatedBorrowedDetails = borrowedDetailsData.map((item) => {
      if (item.id === editData.id) {
        return { ...item, returnQuantity: 0 };
      }
      return item;
    });
    setBorrowedDetailsData(updatedBorrowedDetails);
    onCloseView();
  };

  const returnZero = () => {
    // console.log(borrowedDetailsData[0]?.borrowedPKey);
    setIsLoading(true);
    Swal.fire({
      title: "Confirmation!",
      text: "Changes was not saved. Are you sure you want to exit?",
      icon: "info",
      color: "white",
      background: "#1B1C1D",
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
        try {
          const res = request
            .put(`Borrowed/CloseSaveBorrowed`, [
              {
                borrowedPKey: borrowedDetailsData[0]?.borrowedPKey,
                // returnQuantity: zeroValue,
              },
            ])
            .then((res) => {
              // ToastComponent(
              //   "Success",
              //   "Cancelled !",
              //   "success",
              //   toast
              // );
              onCloseView();
              fetchBorrowedDetails();
            })
            .catch((err) => {
              ToastComponent("Error", err.response.data, "error", toast);
              setIsLoading(false);
            });
        } catch (error) {}
      }
    });
  };

  const editHandler = ({
    id,
    itemCode,
    itemDescription,
    returnQuantity,
    consumes,
    quantity,
  }) => {
    if (
      id &&
      itemCode &&
      itemDescription &&
      returnQuantity >= 0 &&
      consumes >= 0 &&
      quantity
    ) {
      setEditData({
        id: id,
        itemCode: itemCode,
        itemDescription: itemDescription,
        returnQuantity: returnQuantity,
        consumes: consumes,
        quantity: quantity,
      });
      openEdit();
    } else {
      setEditData({
        id: "",
        itemCode: "",
        itemDescription: "",
        returnQuantity: "",
        consumes: "",
        quantity: "",
      });
    }
  };

  const submitBody = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this information?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          if (statusBody.id) {
            const res = request
              .put(`Borrowed/SaveReturnedQuantity`, [
                {
                  id: statusBody.id,
                },
              ])
              .then((res) => {
                fetchBorrowed();
                ToastComponent(
                  "Success",
                  "Returned materials was saved",
                  "success",
                  toast
                );
                onCloseView();
              })
              .catch((err) => {
                ToastComponent(
                  "Error",
                  "Returned materials was not saved",
                  "error",
                  toast
                );
                setIsLoading(false);
              });
          }
        } catch (error) {}
      }
    });
  };

  const coaIdHandler = (data) => {
    // console.log(borrowedDetailsData[0]?.borrowedPKey);
    // console.log(borrowedDetailsData);
    // console.log(data);
    if (data) {
      setCoaId(data);

      openCOA();
    } else {
      setCoaId("");
    }
    console.log(coaId);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={5} fontSize="md"></ModalHeader>
        {/* <ModalCloseButton onClick={onClose} /> */}
        <ModalBody mb={5}>
          <Flex fontSize="sm" justifyContent="center" mb={5}>
            <Text fontWeight="semibold">Approved Borrowed Details</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.borrowedPKey}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.preparedDate).format(
                    "yyyy-MM-DD"
                  )}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Code:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.customerCode}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.customer}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Details:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.remarks}</Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={-1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Company:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.companyCode} - {""}
                  {borrowedDetailsData[0]?.companyName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Department:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.departmentCode} - {""}
                  {borrowedDetailsData[0]?.departmentName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Location:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.locationCode} - {""}
                  {borrowedDetailsData[0]?.locationName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Account Title:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.accountCode} - {""}
                  {borrowedDetailsData[0]?.accountTitles}
                </Text>
              </HStack>
            </VStack>
          </Flex>

          <VStack justifyContent="center">
            <PageScroll minHeight="350px" maxHeight="351px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Id
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Consumed
                    </Th>
                    <Th color="white" fontSize="xs">
                      Returned Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {borrowedDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.id}</Td>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      <Td fontSize="xs">
                        {borrowdetails.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.consumes.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.returnQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td>
                        <Button
                          onClick={() => editHandler(borrowdetails)}
                          // disabled={
                          //     borrowdetails.returnQuantity === borrowdetails.quantity
                          // }
                          colorScheme="blue"
                          size="xs"
                        >
                          Edit
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
            <Flex justifyContent="space-between" mt={5} w="full">
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Requested By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {borrowedDetailsData[0]?.preparedBy}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            {/* <Button colorScheme="blue" onClick={submitBody}> */}
            <Button
              colorScheme="blue"
              onClick={() => coaIdHandler(borrowedDetailsData[0]?.borrowedPKey)}
            >
              Submit
            </Button>
            <Button
              colorScheme="gray"
              onClick={() => returnZero(borrowedDetailsData[0]?.borrowedPKey)}
            >
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>

      {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          editData={editData}
          fetchBorrowedDetails={fetchBorrowedDetails}
        />
      )}

      {isCOA && (
        <AccountTitleModal
          isOpen={isCOA}
          onClose={closeCOA}
          onCloseView={onCloseView}
          borrowedDetailsData={borrowedDetailsData}
          coaId={coaId}
          setCoaId={setCoaId}
          fetchBorrowed={fetchBorrowed}
        />
      )}
    </Modal>
  );
};

export const EditModal = ({
  isOpen,
  onClose,
  editData,
  fetchBorrowedDetails,
}) => {
  const [quantitySubmit, setQuantitySubmit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const quantityHandler = (data) => {
    if (data) {
      setQuantitySubmit(parseFloat(data));
    } else {
      setQuantitySubmit("");
    }
  };

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Borrowed/EditReturnedQuantity`, {
          id: editData.id,
          returnQuantity: quantitySubmit,
        })
        .then((res) => {
          ToastComponent("Success", "Order has been edited!", "success", toast);
          onClose();
          fetchBorrowedDetails();
        })
        .catch((err) => {
          // ToastComponent("Error", err.response.data, "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  const titles = ["Item Code", "Item Description", "Return Quantity"];
  const autofilled = [editData?.itemCode, editData?.itemDescription];

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="primary" color="white">
            <Flex justifyContent="left">
              <Text fontSize="15px">Return Quantity</Text>
            </Flex>
          </ModalHeader>

          <ModalBody>
            {/* <PageScrollReusable minHeight='50px' maxHeight='350px'> */}
            {/* <Text textAlign="center" mb={7} fontSize="sm">
              Are you sure you want to edit this order?
            </Text> */}
            <HStack justifyContent="center" textAlign="start">
              <VStack spacing={4}>
                {titles.map((title) => (
                  <Text w="full" pl={2} key={title} fontSize="xs">
                    {title}
                  </Text>
                ))}
              </VStack>
              <VStack spacing={3.5}>
                {autofilled.map((items) => (
                  <Text
                    w="70%"
                    pl={2}
                    bgColor="gray.200"
                    border="1px"
                    key={items}
                    color="fontColor"
                    fontSize="xs"
                  >
                    {items}
                  </Text>
                ))}
                <Input
                  borderRadius="sm"
                  color="fontColor"
                  fontSize="sm"
                  onChange={(e) => quantityHandler(e.target.value)}
                  value={quantitySubmit}
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  onPaste={(e) => e.preventDefault()}
                  min="1"
                  w="72%"
                  pl={2}
                  h={7}
                  bgColor="#fff8dc"
                  border="1px"
                />
              </VStack>
            </HStack>
            {/* </PageScrollReusable> */}
          </ModalBody>

          <ModalFooter justifyItems="center">
            <ButtonGroup size="xs" mt={5}>
              <Button
                px={4}
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={
                  !quantitySubmit ||
                  isLoading ||
                  quantitySubmit > editData?.quantity
                }
                // disabled={!quantitySubmit || isLoading || quantitySubmit > editData?.consumes}
                colorScheme="blue"
              >
                Save
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="gray"
              >
                Cancel
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    coaId: yup.string(),
    companyId: yup.number().required().typeError("Company Name is required"),
    departmentId: yup
      .number()
      .required()
      .typeError("Department Category is required"),
    locationId: yup.number().required().typeError("Location Name is required"),
    accountTitleId: yup.number().required("Account Name is required"),
  }),
});

// //ACCOUNT TITLE
export const AccountTitleModal = ({
  isOpen,
  onClose,
  borrowedDetailsData,
  coaId,
  setCoaId,
  fetchBorrowed,
  onCloseView,
  // fetchNotification,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);

  // console.log("data", borrowedDetailsData);
  // console.log(
  //   "borrowedDetailsData",
  //   borrowedDetailsData?.find((item) => item.borrowedPKey === coaId).companyCode
  // );

  // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setCompany(res.data.result.companies);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH DEPT API
  const fetchDepartmentApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&api_for=vladimir&company_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setDepartment(res.data.result.departments);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH Loc API
  const fetchLocationApi = async (id = "") => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&api_for=vladimir&department_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setLocation(res.data.result.locations);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH ACcount API
  const fetchAccountApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setAccount(res.data.result.account_titles);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCompanyApi();
    fetchDepartmentApi();
    fetchLocationApi();
    fetchAccountApi();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        borrowedPKey: coaId,
        companyId: "",
        departmentId: "",
        locationId: "",
        accountTitleId: "",
        addedBy: currentUser.userName,
      },
    },
  });

  useEffect(() => {
    setValue(
      "formData.companyId",
      company?.find(
        (x) =>
          x.code ===
          borrowedDetailsData?.find((item) => item.borrowedPKey === coaId)
            .companyCode
      )?.id
    );
  }, [company]);

  useEffect(() => {
    setValue(
      "formData.departmentId",
      department?.find(
        (x) =>
          x.code ===
          borrowedDetailsData?.find((item) => item.borrowedPKey === coaId)
            .departmentCode
      )?.id
    );
  }, [department]);

  useEffect(() => {
    setValue(
      "formData.locationId",
      location?.find(
        (x) =>
          x.code ===
          borrowedDetailsData?.find((item) => item.borrowedPKey === coaId)
            .locationCode
      )?.id
    );
  }, [location]);

  useEffect(() => {
    setValue(
      "formData.accountTitleId",
      account?.find(
        (x) =>
          x.code ===
          borrowedDetailsData?.find((item) => item.borrowedPKey === coaId)
            .accountCode
      )?.id
    );
  }, [account]);

  const submitHandler = async (data) => {
    const submitArrayBody = borrowedDetailsData?.map((item) => {
      return {
        id: coaId,
        companyCode: company?.find((x) => x.id === data.formData.companyId)
          ?.code,
        companyName: company?.find((x) => x.id === data.formData.companyId)
          ?.name,
        departmentCode: department?.find(
          (x) => x.id === data.formData.departmentId
        )?.code,
        departmentName: department?.find(
          (x) => x.id === data.formData.departmentId
        )?.name,
        locationCode: location?.find((x) => x.id === data.formData.locationId)
          ?.code,
        locationName: location?.find((x) => x.id === data.formData.locationId)
          ?.name,
        accountTitles: account?.find(
          (x) => x.id === data.formData.accountTitleId
        )?.name,
        accountCode: account.find((x) => x.id === data.formData.accountTitleId)
          ?.code,
        // addedBy: currentUser.fullName,
      };
    });
    console.log(submitArrayBody);
    try {
      const response = await request
        .put(`Borrowed/SaveReturnedQuantity`, submitArrayBody)
        .then((response) => {
          fetchBorrowed();
          ToastComponent(
            "Success",
            "Returned materials was saved",
            "success",
            toast
          );
          onClose();
          onCloseView();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <ModalContent>
            <ModalHeader>
              <Flex justifyContent="center">
                <Text>Charge of Accounts</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton onClick={onClose} />

            <ModalBody>
              <Stack spacing={2} p={6}>
                <Box>
                  <FormLabel fontSize="sm">Company</FormLabel>

                  <HStack w="full">
                    <Select
                      {...register("formData.companyId")}
                      defaultValue={
                        company?.find(
                          (x) =>
                            x.code ===
                            borrowedDetailsData?.find(
                              (item) => item.borrowedPKey === coaId
                            )?.companyCode
                        )?.id
                      }
                      placeholder="Select Company"
                      fontSize="sm"
                      onChange={(e) => {
                        setValue("formData.departmentId", "");
                        setValue("formData.locationId", "");
                        fetchDepartmentApi(e.target.value);
                      }}
                    >
                      {company?.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.code} - {item.name}
                          </option>
                        );
                      })}
                    </Select>
                  </HStack>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.companyId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Department</FormLabel>
                  <Select
                    {...register("formData.departmentId")}
                    placeholder="Select Department"
                    fontSize="sm"
                    onChange={(e) => {
                      setValue("formData.locationId", "");
                      fetchLocationApi(e.target.value);
                    }}
                  >
                    {department?.map((dept) => {
                      return (
                        <option key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </option>
                      );
                    })}
                  </Select>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.departmentId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Location</FormLabel>
                  <Select
                    {...register("formData.locationId")}
                    placeholder="Select Location"
                    fontSize="sm"
                  >
                    {location?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.code} - {item.name}
                        </option>
                      );
                    })}
                  </Select>

                  <Text color="red" fontSize="xs">
                    {errors.formData?.locationId?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel fontSize="sm">Account Title</FormLabel>
                  <Select
                    {...register("formData.accountTitleId")}
                    placeholder="Select Account"
                    fontSize="sm"
                    bgColor="#fff8dc"
                  >
                    {account?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.code} - {item.name}
                        </option>
                      );
                    })}
                  </Select>
                  <Text color="red" fontSize="xs">
                    {errors.formData?.accountTitleId?.message}
                  </Text>
                </Box>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                // disabled={!isValid}
                colorScheme="blue"
                px={4}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
