import React, { ReactChild } from "react";
import { ViewMode, Task  } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getLocaleMonth,
  getWeekNumberISO8601,
} from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import styles from "./calendar.module.css";
// import { addToDate } from "../../helpers/date-helper";

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
  todayColor: string;
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  tasks: Task[];
};

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
  todayColor,
  dates,
  rowHeight,
  svgWidth,
  tasks
}) => {
  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = date.getFullYear();
      bottomValues.push(
        <text
          key={date.getFullYear()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getFullYear() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getFullYear()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
            tasks={tasks}
            rowHeight={rowHeight}
            svgWidth={svgWidth}
            dates={dates}
            todayColor={todayColor}
            columnWidth={columnWidth}
            rtl={rtl}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  // let y = 0;
  // const gridRows: ReactChild[] = [];
  // const rowLines: ReactChild[] = [
  //   <line
  //     key="RowLineFirst"
  //     x="0"
  //     y1={0}
  //     x2={svgWidth}
  //     y2={0}
  //     className={styles.gridRowLine}
  //   />,
  // ];
  // for (const task of tasks) {
  //   gridRows.push(
  //     <rect
  //       key={"Row" + task.id}
  //       x="0"
  //       y={y}
  //       width={svgWidth}
  //       height={rowHeight}
  //       className={styles.gridRow}
  //     />
  //   );
  //   rowLines.push(
  //     <line
  //       key={"RowLine" + task.id}
  //       x="0"
  //       y1={y + rowHeight}
  //       x2={svgWidth}
  //       y2={y + rowHeight}
  //       className={styles.gridRowLine}
  //     />
  //   );
  //   y += rowHeight;
  // }

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = getLocaleMonth(date, locale);
      bottomValues.push(
        <text
          key={bottomValue + date.getFullYear()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
            tasks={tasks}
            rowHeight={rowHeight}
            svgWidth={svgWidth}
            dates={dates}
            todayColor={todayColor}
            columnWidth={columnWidth}
            rtl={rtl}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount: number = 1;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = "";
      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        // top
        topValue = `${getLocaleMonth(date, locale)}, ${date.getFullYear()}`;
      }
      // bottom
      const bottomValue = `W${getWeekNumberISO8601(date)}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );

      if (topValue) {
        // if last day is new month
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={columnWidth * i + weeksCount * columnWidth}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={columnWidth * i + columnWidth * weeksCount * 0.5}
              yText={topDefaultHeight * 0.9}
              tasks={tasks}
              rowHeight={rowHeight}
              svgWidth={svgWidth}
              dates={dates}
              todayColor={todayColor}
              columnWidth={columnWidth}
              rtl={rtl}
            />
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = `${getLocalDayOfWeek(date, locale, "short")}, ${date
        .getDate()
        .toString()}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i + 1 !== dates.length &&
        date.getMonth() !== dates[i + 1].getMonth()
      ) {
        const topValue = getLocaleMonth(date, locale);

        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) *
                columnWidth *
                0.5
            }
            yText={topDefaultHeight * 0.9}
            tasks={tasks}
            rowHeight={rowHeight}
            svgWidth={svgWidth}
            dates={dates}
            todayColor={todayColor}
            columnWidth={columnWidth}
            rtl={rtl}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${getLocalDayOfWeek(
          date,
          locale,
          "short"
        )}, ${date.getDate()} ${getLocaleMonth(date, locale)}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={topDefaultHeight * 0.9}
            tasks={tasks}
            rowHeight={rowHeight}
            svgWidth={svgWidth}
            dates={dates}
            todayColor={todayColor}
            columnWidth={columnWidth}
            rtl={rtl}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
        const displayDate = dates[i - 1];
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          locale,
          "long"
        )}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, locale)}`;
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + displayDate.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
            tasks={tasks}
            rowHeight={rowHeight}
            svgWidth={svgWidth}
            dates={dates}
            todayColor={todayColor}
            columnWidth={columnWidth}
            rtl={rtl}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  // const now = new Date();
  // let tickX = 0;
  // const ticks: ReactChild[] = [];
  // let today: ReactChild = <rect />;
  // for (let i = 0; i < dates.length; i++) {
  //   const date = dates[i];
  //   ticks.push(
  //     <line
  //       key={date.getTime()}
  //       x1={tickX}
  //       y1={0}
  //       x2={tickX}
  //       y2={y}
  //       className={styles.gridTick}
  //     />
  //   );
  //   if (
  //     (i + 1 !== dates.length &&
  //       date.getTime() < now.getTime() &&
  //       dates[i + 1].getTime() >= now.getTime()) ||
  //     // if current date is last
  //     (i !== 0 &&
  //       i + 1 === dates.length &&
  //       date.getTime() < now.getTime() &&
  //       addToDate(
  //         date,
  //         date.getTime() - dates[i - 1].getTime(),
  //         "millisecond"
  //       ).getTime() >= now.getTime())
  //   ) {
  //     today = (
  //       <rect
  //         x={tickX}
  //         y={0}
  //         width={columnWidth}
  //         height={y}
  //         fill={todayColor}
  //       />
  //     );
  //   }
  //   // rtl for today
  //   if (
  //     rtl &&
  //     i + 1 !== dates.length &&
  //     date.getTime() >= now.getTime() &&
  //     dates[i + 1].getTime() < now.getTime()
  //   ) {
  //     today = (
  //       <rect
  //         x={tickX + columnWidth}
  //         y={0}
  //         width={columnWidth}
  //         height={y}
  //         fill={todayColor}
  //       />
  //     );
  //   }
  //   tickX += columnWidth;
  // }

  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  switch (dateSetup.viewMode) {
    case ViewMode.Year:
      [topValues, bottomValues] = getCalendarValuesForYear();
      break;
      case ViewMode.Month:
        [topValues, bottomValues] = getCalendarValuesForMonth();
        break;
      case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues] = getCalendarValuesForDay();
      break;
    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      [topValues, bottomValues] = getCalendarValuesForPartOfDay();
      break;
    case ViewMode.Hour:
      [topValues, bottomValues] = getCalendarValuesForHour();
  }
  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={45}
        className={styles.calendarHeader}
      />
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={45}
        className={styles.calendarHeader}
      />
      {bottomValues} {topValues}
    </g>
  );
};
