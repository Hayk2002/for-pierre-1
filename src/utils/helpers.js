import i18n from "i18next";
import moment from "moment";
import Highlighter from "react-highlight-words";

import { StyledHourBlock } from "shared/styles";

export const setPageTitle = (title) => {
  document.title = i18n.t(title);
};

export const hideUserEmail = (email) => {
  const hide = email.split("@")[0].length - 1;
  const r = new RegExp(`.{${hide}}@`, "g");

  return email.replace(r, "••••••@");
};

export const objectToForm = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  });

  return formData;
};

export const setItemsToLocalStorage = (items) => {
  Object.entries(items).forEach(([key, value]) => {
    const formattedItem = JSON.stringify(value);
    localStorage.setItem(key, formattedItem);
  });
};

export const getItemFromLocalStorage = (localStorageKey) =>
  JSON.parse(localStorage.getItem(localStorageKey));

export function splitTime(time) {
  return time.split(":", 2).map((item) => Number(item));
}

export function checker(aStartHour, bStartHour, aStartMinute, bStartMinute) {
  if (aStartHour < bStartHour) {
    return -1;
  }
  if (aStartHour > bStartHour) {
    return 1;
  }
  if (aStartMinute < bStartMinute) {
    return -1;
  }
  if (aStartMinute > bStartMinute) {
    return 1;
  }
  return 0;
}

export const generateTimeRange = ({ timelineStart, timelineEnd }) => {
  let finishTime = timelineEnd;
  if (timelineEnd === "23:59:59") {
    finishTime = "24:00";
  }
  const range = [];
  const [startHour, startMinutes] = splitTime(timelineStart);
  const [endHour, endMinutes] = splitTime(finishTime);

  for (let i = startHour; i <= endHour; i += 1) {
    let j = 0;
    if (i === startHour) {
      j = startMinutes;
    }

    let minutesFinish = 55;
    if (i === endHour) {
      minutesFinish = endMinutes;
    }

    for (j; j <= minutesFinish; j += 5) {
      let hour = i;
      let minute = j;
      if (hour < 10) {
        hour = `0${i}`;
      }
      if (minute < 10) {
        minute = `0${j}`;
      }

      range.push({
        value: `${hour}:${minute}`,
      });
    }
  }

  return range;
};

export function removeRepeatingItems(timeArray) {
  const tempObj = {};

  Object.values(timeArray).forEach(({ value }) => {
    tempObj[value] = "value";
  });

  const possibleTimeList = [];

  for (const [key, value] of Object.entries(tempObj)) {
    possibleTimeList.push({
      [value]: key,
    });
  }

  return possibleTimeList.sort((a, b) => {
    const [aStartHour, aStartMinute] = splitTime(a.value);
    const [bStartHour, bStartMinute] = splitTime(b.value);

    return checker(aStartHour, bStartHour, aStartMinute, bStartMinute);
  });
}

export const passwordRegExp =
  /^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*(_)@%&]).{8,}/;

export const extensionRegex = /\/(gif|jpe?g|png|bmp|svg\+xml)$/i;

export const phoneRegExp = /^([0-9][\s]*){9,15}$/;

export const clientMobileRegex = /^[\d]{0,16}$/;

export const removeHighlight = (str) =>
  str.replace(/(<mark style="background-color: yellow">|<\/mark>)/g, "");

export const isUserAuthenticated = () => {
  const token = getItemFromLocalStorage("token");
  return Boolean(token);
};

export function generateServiceDurations(num) {
  const minutes = [];

  for (let i = 5; i <= num; i += 5) {
    minutes.push({
      id: i,
      label: `${i} min`,
    });
  }

  return minutes;
}

export const zoomHandler = (scale) => {
  document.getElementById("timeline").style.zoom = `${scale}%`;
};

export const generateTimeRangeByStep = (start, end, step, callback) => {
  const range = [moment(start, "HH:mm").format("HH:mm")];
  for (
    let i = 0;
    moment(moment(end, "HH:mm")).isAfter(moment(range[i], "HH:mm"));
    i += 1
  ) {
    const nextTime = moment(
      moment(moment(range[i], "HH:mm")).add(+step, "minute"),
    ).format("HH:mm");
    range.push(nextTime === "00:00" ? "24:00" : nextTime);
  }

  if (callback) {
    callback(range);
  }
  return range;
};

export const generateTimelineIntervals = (start, end) => {
  const timeStops = [];

  timeStops.push({ intervalText: start });
  timeStops.push({ intervalText: end });

  return timeStops;
};

export const getTimesAfterGivenTimeInRange = (rangeList, start, end) => {
  if (end) {
    return rangeList.filter(
      (time) =>
        moment(moment(time, "HH:mm")).isAfter(moment(start, "HH:mm")) &&
        moment(moment(time, "HH:mm")).isBefore(moment(end, "HH:mm")),
    );
  }
  return rangeList.filter((time) =>
    moment(moment(time, "HH:mm")).isAfter(moment(start, "HH:mm")),
  );
};

export const antTableSearch = (dataSet, searchKey, fields, callback) => {
  const filteredList = [];
  dataSet.forEach((data) => {
    let alreadyPushed = false;
    fields.forEach((field) => {
      const textToSearch =
        data[field] === "ServiceProvider"
          ? "service provider"
          : data[field]?.toLowerCase().replace(/\s+/g, " ").trim();
      if (textToSearch?.includes(searchKey.toLowerCase()) && !alreadyPushed) {
        filteredList.push({ ...data, searchKey });
        alreadyPushed = true;
      }
    });
  });

  if (callback) {
    callback(filteredList);
  }
};

export const renderRow = (val, searchWords, className = "highlighter") => (
  <Highlighter
    className={className}
    style={{ display: "block" }}
    highlightStyle={{ background: "#ff0" }}
    caseSensitive={false}
    searchWords={[searchWords]}
    textToHighlight={val ?? ""}
  />
);

export const renderHeaderTimes = (start, end, step, stepWidth) => {
  const timesList = generateTimeRangeByStep(start, end, step);
  const minsLength = timesList.length - 1;
  let innerMinsCount = 1;
  return timesList.map((time, index) => {
    if (moment(time, "HH:mm").format("mm") === "00" || minsLength === index) {
      const width = innerMinsCount * stepWidth;
      innerMinsCount = 1;
      return (
        <StyledHourBlock key={time} $width={width}>
          <p>{time}</p>
          <span />
        </StyledHourBlock>
      );
    }

    innerMinsCount += 1;

    return "";
  });
};

export const getComparisonDate = (date) => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();

  return `${year}-${month}-${day}`;
};

export const removeSimilarDates = (data) => {
  data.forEach((item) => (item.toString = () => `${item.date}*`));
  const tmp = [];
  const result = [];

  data.forEach((item) => {
    if (tmp.indexOf(item.toString()) < 0) {
      tmp.push(item.toString());
      result.push(item);
    }
  });

  return result;
};
