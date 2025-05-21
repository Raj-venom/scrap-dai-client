import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import check from "@/assets/images/check.png";
import message from "@/assets/images/message.png";
import noResult from "@/assets/images/no-result.png";
import logo from "@/assets/images/logo.png";
import collector from "@/assets/images/collector.jpg";



export const images = {
  check,
  noResult,
  message,
  logo,
  collector
};

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
};

export const onboarding = [
  {
    id: 1,
    title: "Turn Scrap into Cash",
    description: "Earn money from your scrap while caring for the planet.",
    image: 'https://img.icons8.com/color/240/000000/recycling.png',
  },
  {
    id: 2,
    title: "Instant Savings",
    description: "Sell your scrap quickly simple, secure, and fast.",
    image: 'https://img.icons8.com/color/240/000000/delivery.png'
  },
  {
    id: 3,
    title: "Welcome to Scrap Dai",
    description: "Join us and maximize your scrap's value.",
    image: 'https://img.icons8.com/color/240/000000/earth-planet.png'

  },
];

export const data = {
  onboarding,
};


export const GENDER = ["Male", "Female", "Other"];

export const USER_ROLE = {
  ADMIN: "admin",
  COLLECTOR: "collector",
  USER: "user"
};


export const ORDER_STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  CANCELLED: "Cancelled",
  RECYCLED: "Recycled",
}



export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'text-yellow-600';
    case 'ACCEPTED':
      return 'text-blue-600';
    case 'CANCELLED':
      return 'text-red-500';
    case 'RECYCLED':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};



export const GENDER_OPTIONS = ["Male", "Female", "Other"];
