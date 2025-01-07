import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { clientAPI } from "../api/client";
import { formatDate, formatDateForInput } from "../utils/utils";

const NUMBER_NFT_PER_PAGE = 5;
const queryKey = "employee";

async function fetchEmployee({
  currentPage,
  department,
  search,
  branch,
  saleBlock,
  saleArea,
  supportDepartmentId,
  fullName,
  code,
  status,
}) {
  try {
    const options = {
      limit: NUMBER_NFT_PER_PAGE,
      page: currentPage,
    };
    if (department !== undefined) options.department = department;
    if (search !== undefined) options.search = search;
    if (branch) options.branchId = branch;
    if (saleBlock) options.saleBlockId = saleBlock;
    if (saleArea) options.saleAreaId = saleArea;
    if (supportDepartmentId) options.supportDepartmentId = supportDepartmentId;
    if (status) options.status = status;
    if (fullName) options.fullName = fullName;
    if (code) options.code = code;
    const queryParams = new URLSearchParams(options).toString();

    // Fetch employee data
    let { items, pagination } = await clientAPI(
      "get",
      `/employee?${queryParams}`
    );

    // Transform the employee data
    let newData = [];
    if (department) {
      newData = items?.map((item, index) => {
        return {
          num: index + 1 + NUMBER_NFT_PER_PAGE * (currentPage - 1),
          avatar: item?.avatar,
          code: item?.code || "-",
          fullName: item?.fullName || "-",
          jobTitle: item?.jobTitle?.name || "-",
          saleBlock: item?.saleBlock?.name || "-",
          saleArea: item?.saleArea?.name || "-",
          branch: item?.branch?.name || "-",
          contact: [item?.email, item?.phone],
          identificationNumber: item?.identificationNumber || "-",
          identificationNumberInfo: [
            item?.dateOfIdentification
              ? formatDate(formatDateForInput(item?.dateOfIdentification))
              : "-",
            item?.placeOfIdentification,
          ],
          currentAddress: item?.currentAddress,
          bankInfo: [item?.bankAccount, item?.bankName],
          startTime: item?.startTime
            ? formatDate(formatDateForInput(item?.startTime))
            : "-",
          endTime: item?.endTime
            ? formatDate(formatDateForInput(item?.endTime))
            : "-",
          status: item?.status,
          detail: {
            ...(item?.code && { code: item.code }),
            ...(item?.fullName && { fullName: item.fullName }),
            ...(item?.password && { password: item.password }),
            ...(item?.phone && { phone: item.phone }),
            ...(item?.email && { email: item.email }),
            ...(item?.avatar && { avatar: item.avatar }),
            ...(item?.jobTitleId && { jobTitle: item?.jobTitle?.name }),
            ...(item?.identificationNumber && {
              identificationNumber: item.identificationNumber,
            }),
            ...(item?.dateOfIdentification && {
              dateOfIdentification: item.dateOfIdentification,
            }),
            ...(item?.placeOfIdentification && {
              placeOfIdentification: item.placeOfIdentification,
            }),
            ...(item?.permanentAddress && {
              permanentAddress: item.permanentAddress,
            }),
            ...(item?.currentAddress && {
              currentAddress: item.currentAddress,
            }),
            ...(item?.bankAccount && { bankAccount: item.bankAccount }),
            ...(item?.bankName && { bankName: item.bankName }),
            ...(item?.startTime && { startTime: item.startTime }),
            ...(item?.endTime && { endTime: item.endTime }),
            status: item?.status,
            ...{ department: item.department },
            ...(item?.jobPosition && { jobPosition: item.jobPosition?.name }),
            ...(item?.supportDepartment && {
              supportDepartment: item.supportDepartment?.name,
            }),
            ...(item?.businessCategory && {
              businessCategory: item.businessCategory?.name,
            }),
            ...(item?.guaranteeType && {
              guaranteeType: item.guaranteeType?.name,
            }),
            ...(item?.guaranteeDate && { guaranteeDate: item.guaranteeDate }),
            ...(item?.depositDate && { depositDate: item.depositDate }),
            ...(item?.referralCode && {
              referralCode: item.referralCode?.name,
            }),
            ...(item?.saleBlock && { saleBlock: item.saleBlock?.name }),
            ...(item?.saleArea && { saleArea: item.saleArea?.name }),
            ...(item?.JobTitleCode && { JobTitleCode: item.JobTitleCode }),
            ...(item?.branch && { branch: item.branch?.name }),
          },
          edit: {
            ...(item?._id && { id: item._id }),
            ...(item?.code && { code: item.code }),
            ...(item?.fullName && { fullName: item.fullName }),
            ...(item?.phone && { phone: item.phone }),
            ...(item?.email && { email: item.email }),
            ...(item?.avatar && { avatar: item.avatar }),
            ...(item?.jobTitleId && { jobTitleId: item.jobTitleId }),
            ...(item?.jobPositionId && { jobPositionId: item.jobPositionId }),
            ...(item?.identificationNumber && {
              identificationNumber: item.identificationNumber,
            }),
            ...(item?.dateOfIdentification && {
              dateOfIdentification: formatDateForInput(
                item.dateOfIdentification
              ),
            }),
            ...(item?.placeOfIdentification && {
              placeOfIdentification: item.placeOfIdentification,
            }),
            ...(item?.permanentAddress && {
              permanentAddress: item.permanentAddress,
            }),
            ...(item?.currentAddress && {
              currentAddress: item.currentAddress,
            }),
            ...(item?.bankAccount && { bankAccount: item.bankAccount }),
            ...(item?.bankName && { bankName: item.bankName }),
            ...(item?.startTime && {
              startTime: formatDateForInput(item.startTime),
            }),
            ...(item?.endTime && { endTime: formatDateForInput(item.endTime) }),
            status: item?.status,
            department: item?.department,
            ...(item?.supportDepartmentId && {
              supportDepartmentId: item.supportDepartmentId,
            }),
            ...(item?.businessCategoryId && {
              businessCategoryId: item.businessCategoryId,
            }),
            ...(item?.guaranteeTypeId && {
              guaranteeTypeId: item.guaranteeTypeId,
            }),
            ...(item?.guaranteeDate && {
              guaranteeDate: formatDateForInput(item.guaranteeDate),
            }),
            ...(item?.depositDate && {
              depositDate: formatDateForInput(item.depositDate),
            }),
            ...(item?.referralCodeId && {
              referralCodeId: item.referralCodeId,
            }),
            ...(item?.saleBlockId && { saleBlockId: item.saleBlockId }),
            ...(item?.saleAreaId && { saleAreaId: item.saleAreaId }),
            ...(item?.JobTitleCode && { JobTitleCode: item.JobTitleCode }),
            ...(item?.branchId && { branchId: item.branchId }),
          },
        };
      });
    } else {
      newData = items?.map((item, index) => {
        return {
          num: index + 1 + NUMBER_NFT_PER_PAGE * (currentPage - 1),
          avatar: item?.avatar,
          code: item?.code || "-",
          fullName: item?.fullName || "-",
          jobTitle: item?.jobTitle?.name || "-",
          supportDepartment: item?.supportDepartment?.name || "-",
          branch: item?.branch?.name || "-",
          contact: [item?.email, item?.phone],
          identificationNumber: item?.identificationNumber || "-",
          identificationNumberInfo: [
            item?.dateOfIdentification
              ? formatDate(formatDateForInput(item?.dateOfIdentification))
              : "-",
            item?.placeOfIdentification,
          ],
          currentAddress: item?.currentAddress,
          bankInfo: [item?.bankAccount, item?.bankName],
          startTime: item?.startTime
            ? formatDate(formatDateForInput(item?.startTime))
            : "-",
          endTime: item?.endTime
            ? formatDate(formatDateForInput(item?.endTime))
            : "-",
          status: item?.status,

          detail: {
            ...(item?.code && { code: item.code }),
            ...(item?.fullName && { fullName: item.fullName }),
            ...(item?.password && { password: item.password }),
            ...(item?.phone && { phone: item.phone }),
            ...(item?.email && { email: item.email }),
            ...(item?.avatar && { avatar: item.avatar }),
            ...(item?.jobTitleId && { jobTitle: item?.jobTitle?.name }),
            ...(item?.identificationNumber && {
              identificationNumber: item.identificationNumber,
            }),
            ...(item?.dateOfIdentification && {
              dateOfIdentification: item.dateOfIdentification,
            }),
            ...(item?.placeOfIdentification && {
              placeOfIdentification: item.placeOfIdentification,
            }),
            ...(item?.permanentAddress && {
              permanentAddress: item.permanentAddress,
            }),
            ...(item?.currentAddress && {
              currentAddress: item.currentAddress,
            }),
            ...(item?.bankAccount && { bankAccount: item.bankAccount }),
            ...(item?.bankName && { bankName: item.bankName }),
            ...(item?.startTime && { startTime: item.startTime }),
            ...(item?.endTime && { endTime: item.endTime }),
            status: item?.status,
            ...{ department: item.department },
            ...(item?.jobPosition && { jobPosition: item.jobPosition?.name }),
            ...(item?.supportDepartment && {
              supportDepartment: item.supportDepartment?.name,
            }),
            ...(item?.businessCategory && {
              businessCategory: item.businessCategory?.name,
            }),
            ...(item?.guaranteeType && {
              guaranteeType: item.guaranteeType?.name,
            }),
            ...(item?.guaranteeDate && { guaranteeDate: item.guaranteeDate }),
            ...(item?.depositDate && { depositDate: item.depositDate }),
            ...(item?.referralCode && {
              referralCode: item.referralCode?.name,
            }),
            ...(item?.saleBlock && { saleBlock: item.saleBlock?.name }),
            ...(item?.saleArea && { saleArea: item.saleArea?.name }),
            ...(item?.JobTitleCode && { JobTitleCode: item.JobTitleCode }),
            ...(item?.branch && { branch: item.branch?.name }),
          },
          edit: {
            ...(item?._id && { id: item._id }),
            ...(item?.code && { code: item.code }),
            ...(item?.fullName && { fullName: item.fullName }),
            ...(item?.phone && { phone: item.phone }),
            ...(item?.email && { email: item.email }),
            ...(item?.avatar && { avatar: item.avatar }),
            ...(item?.jobTitleId && { jobTitleId: item.jobTitleId }),
            ...(item?.jobPositionId && { jobPositionId: item.jobPositionId }),
            ...(item?.identificationNumber && {
              identificationNumber: item.identificationNumber,
            }),
            ...(item?.dateOfIdentification && {
              dateOfIdentification: formatDateForInput(
                item.dateOfIdentification
              ),
            }),
            ...(item?.placeOfIdentification && {
              placeOfIdentification: item.placeOfIdentification,
            }),
            ...(item?.permanentAddress && {
              permanentAddress: item.permanentAddress,
            }),
            ...(item?.currentAddress && {
              currentAddress: item.currentAddress,
            }),
            ...(item?.bankAccount && { bankAccount: item.bankAccount }),
            ...(item?.bankName && { bankName: item.bankName }),
            ...(item?.startTime && {
              startTime: formatDateForInput(item.startTime),
            }),
            ...(item?.endTime && { endTime: formatDateForInput(item.endTime) }),
            status: item?.status,
            department: item?.department,
            ...(item?.supportDepartmentId && {
              supportDepartmentId: item.supportDepartmentId,
            }),
            ...(item?.businessCategoryId && {
              businessCategoryId: item.businessCategoryId,
            }),
            ...(item?.guaranteeTypeId && {
              guaranteeTypeId: item.guaranteeTypeId,
            }),
            ...(item?.guaranteeDate && {
              guaranteeDate: formatDateForInput(item.guaranteeDate),
            }),
            ...(item?.depositDate && {
              depositDate: formatDateForInput(item.depositDate),
            }),
            ...(item?.referralCodeId && {
              referralCodeId: item.referralCodeId,
            }),
            ...(item?.saleBlock && { saleBlock: item.saleBlock }),
            ...(item?.saleArea && { saleArea: item.saleArea }),
            ...(item?.JobTitleCode && { JobTitleCode: item.JobTitleCode }),
            ...(item?.branchId && { branchId: item.branchId }),
          },
        };
      });
    }

    const totalpages = Math.ceil(pagination?.total / NUMBER_NFT_PER_PAGE);
    const entries = pagination?.total;
    const startEntry = (pagination?.page - 1) * pagination?.limit + 1;
    const endEntry = Math.min(pagination?.page * pagination?.limit, entries);
    return { data: newData, totalpages, entries, startEntry, endEntry };
  } catch (error) {
    console.log("error", error);
    return { data: [], totalpages: 0, entries: 0, startEntry: 0, endEntry: 0 };
  }
}

export function useEmployee(
  department,
  search,
  branch,
  saleBlock,
  saleArea,
  supportDepartmentId,
  fullName,
  code,
  status
) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: [
      queryKey,
      currentPage,
      department,
      search,
      branch,
      saleBlock,
      saleArea,
      supportDepartmentId,
      fullName,
      code,
      status,
    ],
    queryFn: () =>
      fetchEmployee({
        currentPage,
        department,
        search,
        branch,
        saleBlock,
        saleArea,
        supportDepartmentId,
        fullName,
        code,
        status,
      }),
    refetchOnWindowFocus: false,
  });

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  useEffect(() => {
    if (data?.totalpages && currentPage > data.totalpages) {
      setCurrentPage(data.totalpages);
    }
  }, [currentPage, data?.totalpages]);

  return {
    employeeData: data?.data,
    totalPages: data?.totalpages,
    refetch,
    isLoading,
    isRefetching,
    prevPage,
    nextPage,
    setCurrentPage,
    currentPage,
    entries: data?.entries,
    startEntry: data?.startEntry,
    endEntry: data?.endEntry,
  };
}
