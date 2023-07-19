import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import request from '../../../services/ApiClient'
import PageScroll from '../../../utils/PageScroll'
import moment from 'moment'

const fetchTransactedMoveOrdersApi = async (dateFrom, dateTo) => {
  const res = await request.get(`Reports/TransactedMoveOrderReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const TransactedMOHistory = () => {
  return (
    <div>TransactedMOHistory</div>
  )
}
