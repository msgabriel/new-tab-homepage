import { MonthNames, WeekdayName } from "../constants/time.constants";

const now: Date = new Date();

const hours = now.getHours();
const day: number = now.getDate();

const weekday: number = now.getDay();
const weekdayName: string = WeekdayName[weekday];

const month: number = now.getMonth();
const monthName: string = MonthNames[month];

const isMorning: boolean = hours > 5  && hours <= 12;
const isAfternoon: boolean = hours > 12 && hours <= 17;
const isEvening: boolean = hours > 17 && hours <= 22;
const isNight: boolean = hours > 22 || hours <= 5;

const getGreeting = () => {
  if (isMorning) {
    return "good morning"
  }

  if (isAfternoon) {
    return "good afternoon"
  }

  if (isEvening) {
    return "good evening"
  }

  if (isNight) {
    return "good night"
  }

  return "good day";
}

export const greeting = getGreeting();

export const time = now.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: false
});

export const date = `${weekdayName}, ${day} ${monthName}`;