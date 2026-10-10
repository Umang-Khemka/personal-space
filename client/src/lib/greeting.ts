export const greeting = (d: Date = new Date()) => {
  const h = d.getHours();
  return h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};