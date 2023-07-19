import React, { useState, useEffect } from "react";
import { usePagination } from "@ajna/pagination";
import request from "../../../services/ApiClient";
import { ForApprovalMoveOrder } from "./ForApprovalMoveOrder";
// import apiClient from '../../services/apiClient'
// import { ForApprovalMoveOrder } from './forapproval/For-Approval-Move-Order'

const fetchForApprovalMOApi = async (pageNumber, pageSize, search, status) => {
  const res = await request.get(
    `Ordering/GetAllForApprovalMoveOrderPaginationOrig?pageSize=${pageSize}&pageNumber=${pageNumber}&search=${search}&status=${status}`
  );
  return res.data;
};

const fetchViewApi = async (mirId) => {
  const res = await request.get(
    `Ordering/ViewMoveOrderForApproval?id=${mirId}`
  );
  return res.data;
};

const ForApprovalMo = () => {
  const [forApprovalData, setForApprovalData] = useState([]);
  const [search, setSearch] = useState("");
  const [pageTotal, setPageTotal] = useState(undefined);
  const [mirId, setMirId] = useState("");
  const [mirNo, setMirNo] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [status, setStatus] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 10 },
  });

  //List
  const fetchForApprovalMO = () => {
    fetchForApprovalMOApi(currentPage, pageSize, search, status).then((res) => {
      setForApprovalData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchForApprovalMO();

    return () => {
      setForApprovalData([]);
    };
  }, [pageSize, currentPage, search, status]);

  //For View and Printing Layout
  const fetchView = () => {
    fetchViewApi(mirId).then((res) => {
      setViewData(res);
    });
  };

  useEffect(() => {
    if (mirId) {
      fetchView();
    }

    return () => {
      setViewData([]);
    };
  }, [mirId]);

  return (
    <ForApprovalMoveOrder
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
      setSearch={setSearch}
      pagesCount={pagesCount}
      currentPage={currentPage}
      pageSize={pageSize}
      forApprovalData={forApprovalData}
      fetchForApprovalMO={fetchForApprovalMO}
      mirId={mirId}
      setMirId={setMirId}
      mirNo={mirNo}
      setMirNo={setMirNo}
      viewData={viewData}
      status={status}
      setStatus={setStatus}
      checkedItems={checkedItems}
      setCheckedItems={setCheckedItems}
      //   fetchNotification={fetchNotification}
    />
  );
};

export default ForApprovalMo;
