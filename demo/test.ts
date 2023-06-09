import { HOUR, flattenSlots, isAvailable } from "timeslot-ts";

let slots = flattenSlots({
  whitelistSlots: [
    {
      start: "00:00",
      end: "00:00",
      quota: 10,
    },
  ],
  blacklistSlots: [{ start: "09:00", end: "10:59", quota: 2 }],
  interval: HOUR,
});

console.log(
  isAvailable(slots, {
    start: "10:00",
    end: "12:00",
    interval: HOUR,
    quota: 9,
  })
);
