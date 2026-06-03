export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function calculateTotalPrice(pricePerHour, startTime, endTime) {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  const totalMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
  const hours = totalMinutes / 60;
  return pricePerHour * hours;
}

export function getStatusColor(status) {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
