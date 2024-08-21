import React, { useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactToPrint from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";

import { selectPrintData } from "store/selectors";
import UserCalendarBody from "./userCalendarBody";
import { getPrintData } from "../../actions";
import { PrintBtn, PrintBodyWrapper } from "../../styles";

const Print = ({
  accountId,
  currentDate,
  selectedBranch,
  timeInterval,
  appointments,
}) => {
  const dispatch = useDispatch();
  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);

  const printData = useSelector(selectPrintData);

  useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBeforeGetContentResolve.current]);

  const reactToPrintContent = useCallback(() => componentRef.current, []);
  const reactToPrintTrigger = useCallback(
    () => (
      <PrintBtn>
        <PrinterOutlined />
      </PrintBtn>
    ),
    [],
  );

  const handleOnBeforeGetContent = useCallback(
    () =>
      new Promise((resolve) => {
        onBeforeGetContentResolve.current = resolve;

        if (selectedBranch?.id && accountId) {
          dispatch(
            getPrintData(
              {
                accountIds: [accountId],
                branchId: selectedBranch?.id,
                date: currentDate,
                timeInterval: timeInterval === "day" ? 0 : 1,
              },
              () => resolve(),
            ),
          );
        }
      }),
    [accountId, currentDate, dispatch, selectedBranch?.id, timeInterval],
  );

  return (
    <>
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle="AwesomeFileName"
        removeAfterPrint
        onBeforeGetContent={handleOnBeforeGetContent}
        trigger={reactToPrintTrigger}
      />
      <PrintBodyWrapper>
        <div ref={componentRef}>
          <UserCalendarBody
            printData={printData}
            branchName={selectedBranch?.name}
            appointments={appointments}
            selectedBranch={selectedBranch}
            timeInterval={timeInterval}
          />
        </div>
      </PrintBodyWrapper>
    </>
  );
};

export default Print;
