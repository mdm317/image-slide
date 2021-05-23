const mockImageList = [
  { url: "/images/1.jpg", name: "ASDF", author: "Saydung89" },
  { url: "/images/2.png", name: "SDFXCV", author: "Prawny" },
  { url: "/images/3.jpg", name: "WEFXCB", author: "Cdd20" },
  { url: "/images/4.png", name: "MHES", author: "Zweed_N_roll" },
  { url: "/images/5.jpg", name: "WERFH", author: "Cdd20" },
  { url: "/images/6.jpg", name: "HGJKLBNM", author: "Saydung89" },
  { url: "/images/7.png", name: "DSTRH", author: "lucianapappdesign" },
  { url: "/images/8.jpg", name: "MTRYHUJ", author: "BrianSarubbi97" },
  { url: "/images/9.jpg", name: "VDS", author: "Saydung89" },
  { url: "/images/10.jpg", name: "SDFGR", author: "BrianSarubbi97" },
];

export const getImageList = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(mockImageList);
    }, 1000);
  });
};
