type AnsiColor = {
  name: string;
  bg?: string;
  bg2?: string;
  normal: string;
  bright: string;
};

const colors: AnsiColor[] = [
  { name: "black", bg: "#131313", normal: "#131313", bright: "#4A5057" },
  { name: "red", bg: "#59001E", bg2: "#190004", normal: "#EE6D85", bright: "#FF90A1" },
  { name: "green", bg: "#2C4900", bg2: "#0F1C00", normal: "#95C561", bright: "#AEDF7B" },
  { name: "yellow", bg: "#523500", bg2: "#201200", normal: "#D7A65F", bright: "#F2BF78" },
  { name: "blue", bg: "#07216C", bg2: "#000226", normal: "#7199EE", bright: "#8FB3FF" },
  { name: "magenta", bg: "#340E5E", bg2: "#0A001A", normal: "#A485DD", bright: "#BD9EF8" },
  { name: "cyan", bg: "#002D29", bg2: "#000505", normal: "#38A89D", bright: "#56C1B6" },
  { name: "white", normal: "#BFC2CC", bright: "#E0E2EA" },
];

const swatch = (hex?: string) =>
  hex ? `\x1b[48;2;${hex.slice(1).match(/../g)!.map((x) => parseInt(x, 16)).join(";")}m  \x1b[0m ${hex}` : "—";

for (const color of colors) {
  console.log(`${color.name.padEnd(8)} bg2 ${swatch(color.bg2)}  bg ${swatch(color.bg)}  normal ${swatch(color.normal)}  bright ${swatch(color.bright)}`);
}
